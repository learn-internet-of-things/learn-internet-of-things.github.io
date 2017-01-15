---
layout: page
title: Hardware Design
permalink: /hardware/design/
---

<!--- <img src="/media/liot_esp8266_env/hardware/design/header.png" width="100%" /> -->

Now that a suitable pin assignment has been found (see [Hardware Planning](/hardware/planning/)), it can be continued with the design of the schematic circuit diagram.
Thanks to digital technology it has become much easier even for beginners to design own schematics.
A computer scientist also benefits from the fact that he is familiar with Boolean logic.
The necessary knowledge includes passive and active electrical components (see [Electrical Components](/hardware/basics/#electrical-components)) and the functional principle of general-purpose input/outputs (see [GPIO](/hardware/interfaces/#general-purpose-inputoutput)).
In addition, knowledge of some domain-specific names as the IC power-supply pins (VCC, GND, etc.) is required.
Equipped with the basic knowledge it is possible to adopt new concepts whenever needed.


CAD Software
------------

The hardware will be designed with the popular CAD software [Eagle](http://www.cadsoft.de/download-eagle/eagle-freeware/).
Other options exist.

<!--
The software launches with its *Control Panel*.
Create a new *Project* by clicking *File*, *New* and *Project*.
By rightclicking the just created project, you can now create a new *Schematic* for your project.
This opens the Eagle editor.

The left panel contains the *Command Menu*, the top panel contains all *Actions* and *Parameters*.
The command menu also includes all tools.
All these *Commands* can also be executed by just typing their names in and confirming then by pressing the *Enter* key.
 
In an empty schematic, the only *Parameter* that can be changed, is the *Grid*.
We will change the grid often later, but it is `usually not necessary to change the grid in the schematics view.
One of the only actions that are interesting at the beginning, is the *Create board / Change to board* button.
Once you did this, the boards and schematics files will be kept synchronized.

In a schematic, basically *Devices* are connected by different types of wires.
Each device consists of a *Symbol* for the schematic and a *Package* that defines the dimensions and the connections of a device.
Devices are grouped into libraries that can also be downloaded at various places in the internet.
There are some basic devices like resistors, transistors, etc. that are provided by the default Eagle libraries.
When designing your custom PCB, you will also need devices that are not included in these default libraries.
Instead of downloading libraries that include your device of choise from other people, you should create and maintain your own libraries.
Learning how to create custom devices may take only about half an hour.
Then, you are able to grab the datasheets of your devices and create them yourself.
That's the only way to be sure not to copy the mistakes of others.

Before starting with adding devices to your schematic, let's create an own device - the ESP8266EX.

Switch to the control panel window and select *File*, *New* and *Library*.
-->


Microcontroller
---------------

Usually, the design starts with the cornerstone of the board, the microcontroller.
Espressif calls his ESP8266EX, as already mentioned, "the most integrated Wi-Fi chip in the industry".
Good arguments for this are that the ESP8266EX already "integrates antenna switches, RF balun, power amplifier, low noise receive amplifier, filters and power management modules".
For this reason, the connections to the ESP8266EX are very clear.
As with all subsequent components, the connections follow the reference design of the datasheet.
The reference design of the ESP8266EX is shown in the following figure.

![ESP8266 Microcontroller Power Supply](/media/liot_esp8266_env/hardware/design/esp8266ex-reference.png)
*ESP8266EX Reference Design*

Our own design is started with the power supply.
There is the possibility to power the chip from two different voltage circuits, in order to keep the interference in the voltage circuits for analog signals as low as possible.
But, as no plain analog components are present virtually, this option becomes obsolete.
Instead, the same 3.3 V source can be connected to all voltage supply pins, and the only GND pad in the center of the chip is connected to ground.
The decoupling capacitors, that are recommended in the reference design, are moved to the LDO regulator which will be discussed later, and will be placed close to the ESP8266EX.
Furthermore, the CHIP_EN pin is pulled high, so that the chip is always enabled when voltage is applied, and RES12K is connected to ground via the envisaged 12 kΩ resistor.
The power supply of the real-time clock (RTC) is left floating as it will not be used.

![ESP8266 Microcontroller Power Supply](/media/liot_esp8266_env/hardware/design/mcu-power.png){:width="75%"}

Next, an external crystal (abbreviated with XTAL) for the controller clock will be connected.
The datasheet promises support for crystal frequency ranges from 26 MHz to 52 MHz, but the values of other schematics like the schematic of Espressif’s ESP8266EX module “ESP-WROOM-01”, should be accepted, which were always 26 MHz.
The connection of the crystal follows the circuit from the “System Description” with two 10 pF decoupling capacitors.

![ESP8266 Microcontroller Crystal](/media/liot_esp8266_env/hardware/design/mcu-xtal.png){:width="75%"}

One of the most interesting “components” is the Wi-Fi antenna.
Normally, a ceramic antenna would be used, but since the basic components should be as low in price as possible, the antenna will be implemented directly as a "track" on the board.
For this purpose, the reference design from Texas Instruments is used, to which many other manufacturers fall back on.

*Small Size 2.4 GHz PCB Antenna Photo*

This passive antenna is connected to the integrated low-noise amplifier (LNA) via an impedance matching circuit.
Usually, only the capacitor with a value of 5.6 pF is needed - the inductors are only needed in the case of an impedance mismatch.

![ESP8266 Microcontroller Antenna](/media/liot_esp8266_env/hardware/design/mcu-antenna.png){:width="75%"}

The remaining connections are the buses for SPI (flash memory), HSPI
(RF transceiver), I2C (sensors and port expander) and UART (USB-to-serial
converter), that result from the planning period. Furthermore, an additional
self-defined “IO” bus is used for a better overview in the schematic circuit
diagram. It is used for special GPIOs, like the reset line from and to the
ESP8266EX, the analog input of the ESP8266EX (TOUT), the reset line to
the TCA6416A port expander, and the interrupt line from the port expander.

![ESP8266 Microcontroller IO Busses](/media/liot_esp8266_env/hardware/design/mcu-io.png){:width="75%"}

All connections described can be viewed together in the following figure.

![ESP8266 Microcontroller](/media/liot_esp8266_env/hardware/design/mcu.png){:width="75%"}


Battery Power Supply
--------------------

To ensure a mobile usage, the entire board is designated to be powered by a rechargeable Li-Ion battery.
The actual power supply is done in interaction of the TPS73733 low-dropout (LDO) regulator and the LTC2950 push button on/off controller.
The battery is connected directly to the regulator and the controller, that are both compatible to its fluctuating voltage levels.
If the push button (PB) input of the on/off controller is pulled low, for the time that is configured by the two external capacitors, it switches the enable (EN) output, that is used as the enable (EN) input of the regulator.
By pulling the enable pin high, the regulator is turned on and provides the 3.3 V supply voltage for the other board components.
The capacitor connected to the FR pin “bypasses noise generated by the internal bandgap, reducing output noise to [a] very low level”, which is important on RF boards.
Certainly, this method does not allow the microcontroller to turn itself on, but it can be used to turn itself off.
This is done by pulling the KILL pin of the on/off controller low, “which in turn releases the the enable output”.

The ESP8266EX has a single analog to digital converter (ADC) that can be used to measure the input voltage of the TOUT pin.
However, the maximum input voltage may only be 1.0 V, so that a voltage divider needs to be used, in order to measure the battery voltage of up to 4.2 V.
If resistors with sufficiently high values are used for its implementation, the energy that will get lost can be greatly reduced, but it can not be eliminated completely.
For this reason, it will be possible to turn the voltage divider input on and off for every measurement by using the I/O expander.

![Battery Power Supply](/media/liot_esp8266_env/hardware/design/ldor.png)


Serial Flash Memory
-------------------

The external flash memory has to be connected only to the corresponding lines of the SPI bus.
Espressif recommends a weak resistor of 200 Ω within the clock line "to reduce the drive current and eliminate external interruption", which is shown in the following figure.

![Serial Flash Memory](/media/liot_esp8266_env/hardware/design/flash.png){:width="33%"}


USB Port Components
-------------------

The USB port on the board is used for two tasks.
On the one hand it provides the current, that is required for charging the battery, and thus feeds the charge management controller.
On the other hand it can be used to load the firmware to the microcontroller, and read inputs from a serial console or write output to it.

The MCP73831 charge management controller is active, if the programming pin (PROG) is pulled low.
The resistor on this pin, with a value of 2 kΩ, determines the charging current of 500 mA.
The charging process is started when a partially charged battery is detected on the intended battery pin (BAT), and can be indicated by an LED that is connected to the charge status pin (CHRG).
If the controller is not needed, it powers itself down, so that there is no further circuit needed for this purpose.

The selected USB-to-UART bridge CP2102 can be USB self-powered by its internal voltage regulator.
The configuration again can be taken directly from the datasheet.
Then, only D+ and D- from the USB have to be connected to the intended pins.
On the other hand, RXD, TXD, DTR and RTS are simply connected to the UART bus.
The test pads for RXD and TXD are used as fall back connections, in case of a malfunction of the CP2102.
Lastly, reset (RST) should be pulled high in order to avoid uncontrolled restarts caused by interferences.

![USB Port Components](/media/liot_esp8266_env/hardware/design/usb.png){:width="65%"}


Boot Mode Selection
-------------------

As described on the planning page, the ESP8266EX boot mode is selected by pulling the pins 13, 14 and 15 high or low.
For the case that the automatic boot mode selection for firmware uploads is not working, and in order to be able to restart the MCU manually, both the automatic boot mode selection and the push buttons will be used on the board.

![Boot Mode Selection](/media/liot_esp8266_env/hardware/design/auto-program.png){:width="22%"}


I/O Port Expander
-----------------

The TCA6416 I/O port expander is the first of the three selected I2C slaves that will be connected.
The pull-up resistors in this section of the schematic circuit diagram also determine the default boot mode (booting from serial flash memory).
The reset and interrupt (INT) lines need to be pulled up for a well defined signal level.
The I2C lines need them in order to be able to get a high level since I2C must be implemented with open collector outputs.

Apart from that, the I/O ports are only led out to a dedicated I/O expander bus.
Moreover, the address pin (ADDR) is connected to ground to set the I2C slave address to 0x20.

Port line 0 of the I/O expander bus is used to control some functions on the board, while port line 1 will be left unused for the moment.
For example, port P0.4 is used to turn the buzzer, that is “multiplexed” with the I2C clock line, on and off.
The already presented circuit, for enabling the voltage
measurement of the battery via the voltage divider, also follows this principle.
Additionally, two ports are used to drive the depicted LEDs and another is used to turn off the on/off controller.

![I/O Port Expander](/media/liot_esp8266_env/hardware/design/port-exp.png){:width="76%"}


868 MHz Transceiver
-------------------

The schematic for the CC1101 Sub-1 GHz again was taken directly from its datasheet.
There, the values for the components for the use as a 868 MHz transceivers are given, and it is referred to a reference design that shows the necessary power supply decoupling capacitors.
But, instead of implementing the balun (balanced-unbalanced) circuit for the antenna with inductors and capacitors as shown in the datasheet, a particular balun component from Johanson Technology, the DN025, will be used.
This saves space and reduces the overall number of components.
By using this component its corresponding impedance matching circuit should be used as it is recommended by the balun datasheet, instead of using what is defined in CC1101 datasheet.
Furthermore, it also needs a 26 MHz crystal oscillator that is connected just as the crystal oscillator of the ESP8266EX.
The HSPI lines are connected corresponding to the intended pins, and GDO0 and GDO2 will be connected to the ESP8266EX via the I/O expander.
These pins belong to configurable outputs which generate interrupts for different events like carrier sense, packet receive, etc.

![I/O Port Expander](/media/liot_esp8266_env/hardware/design/rf-transc.png){:width="76%"}


Sensors
-------

The schematic for the BNO055 also looks slightly more complex, due to its integrated ARM Cortex-M0 microcontroller.
This requires another (watch) crystal oscillator for a higher time precision and again some decoupling capacitors.
By setting PS0 and PS1 low, the interface is set to I2C and by setting COM3 high, the address is set to 0x29.
Other pins like COM2, PIN10, PIN15 or PIN16 only need to be connected to ground, to provide the GND I/O level.
Boot and reset need to be pulled up, so that the sensor is enabled whenever power is supplied.
COM0 and COM1 are used as I2C data and clock pins, INT is a configurable interrupt pin that is connected to the I/O expander as well.

Similarly, the I2C interface on BME280 is selected via pin CSB and the slave address 0x77 via SDO.
The rest is standard procedure and self-explained by the pin names.

![Sensors](/media/liot_esp8266_env/hardware/design/sensor.png)


External Pins
-------------

In order to connect external components or an oscilloscope to inspect the interface lines, some pin headers are added to the schematic.
These are used to lead out the I2C, the HSPI or the lines of port 1 of the I/O expander.
The power supply pins for 3.3 V and GND, as well as for the battery voltage are lead out.

![External Pins](/media/liot_esp8266_env/hardware/design/pinout.png){:width="25%"}


Complete Design
---------------

![LIOT_ESP8266_ENV Schematic](/media/liot_esp8266_env/liot_esp8266_env-schematic.png)
*LIOT_ESP8266_ENV Schematic [^schematic]*


References
----------

[^schematic]: [LIOT - LIOT_ESP8266_ENV Schematic (Eagle)](/media/liot_esp8266_env/documents/liot_esp8266_env.sch)