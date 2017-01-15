---
layout: page
title: Hardware Planning
permalink: /hardware/planning/
---

If you are used to program usual computer or smartphone apps, web applications or comparable software, you are probably used to try things out until they start to work.
When dealing with hardware dependent programming, this might become already a bit risky, because you could make an irrevocable error that prevents you from undoing that failure again, although the hardware is possibly still intact.
Then, you are forced to switch to a lower level to remedy the defect for example.
But if you are planning and assembling some hardware, you must not make any mistakes or you might destroy your new ICs or get a set of useless PCBs.
So, the planning process has to be done very carefully.

<!--
LIOT_ESP8266_ENV

It doesn't really matter what the LIOT-ESP8266 board can do.
Rather, it is relevant what concepts are covered by the selected components.
These concepts include electrotechnical basics, connection interfaces, transmission standards and other features supported by the used hardware.
-->


Microcontroller
---------------

A good start is to have a clear overview over the capabilities of the hardware that should be used.
In general one needs to know what peripherals should be used to find a microcontroller that meets the requirements.
In this case, the microprocessor ESP8266EX is chosen mainly due to its unbeatable price and its integrated Wi-Fi.
The fact that it is capable to meet our requirements is anticipated, you will get an idea of how to find a processor for your requirements anyway.
You can find more details for the reasons choosing this device in the master's thesis in the download section.

![ESP8266EX Microcontroller Unit](/media/liot_esp8266_env/hardware/planning/esp8266ex-image.png)
*ESP8266EX Microcontroller Unit*

The ESP8266EX is a bit complicated in gathering all the needed data because Espressif Systems, the manufacturer of the chip, keeps itself covered or omits a lot of documentation.
This is bothersome on the one hand, but helps to reflect on the important things.

![ESP8266EX Pin Layout](/media/liot_esp8266_env/hardware/planning/esp8266ex-pin-layout.png)
*ESP8266EX Pin Layout[^esp8266ex-datasheet]*

You will find the information that the chip "integrates an enhanced version of Tensilica's L106 Diamond series 32 bit processor" that is running normally at a speed of 80 MHz.
Cadence, that is the new name of the Tensilica processors manufacturer, declares them as "based on an industry-standard architecture" and "smaller than the ARM7 or Cortex-M3 cores" based on the chosen manufacturing process.
Absolute values for the provided memory are hard to find.
The chip possibly includes 64 KB of instruction RAM, 96 KB of data RAM and 64 KB of ROM.
Around 50 KB of these are accessible in heap and data section when ESP8266EX is working in Wi-Fi station mode and is connected to the router.
The ROM is not programmable, therefore, user programs must be stored in an external SPI flash memory that can have a size up to 16 MB (128 Mbit).
These values are not very high, but an acceptable base to work with.

Another important information are the number of GPIOs and the available interfaces.
The ESP8266EX has 17 GPIO's that are multiplexed with other functions like PWM, SDIO, SPI, UART or I2S.

For a complete list, you can see the table below, that is mainly taken from the ESP8266EX datasheet[^esp8266ex-datasheet].
The pin description is fitted a bit to the applications that are really used.

![ESP8266EX Pin Description](/media/liot_esp8266_env/hardware/planning/esp8266ex-pin-description.png)
*ESP8266EX Pin Description [^esp8266ex-datasheet] [^pin-description]*

<!--
################

Then, it is started with the main connections on the board.
If possible, pins, on which hardware support for the intended interface is available, should always be selected for a connection.
Once there are conflicts, for example when there is hardware support available for a I²C and a SPI line on a certain pin and only at this pin, a compromise must be found.
It should be taken into consideration if a component that might support I²C or SPI is really needed, and if it can rather be connected to I²C instead of to SPI or vice versa.
It might be possible, that there are alternative components that support the other interface.
And even if these considerations do not lead to a suitable solution, it may be questioned if one of the protocols can be implemented in software (without hardware support).
In this case, this would be more likely I²C.
It can also be possible that the chosen microcontroller simply does not meet the requirements.
Therefore, it is very helpful to first create those tables.
This illustrates very quickly, whether the microcontroller is suitable, and it avoids wasting time, which might be caused by the creation of symbols and footprints (packages) in the CAD software.

################

The first focus of the board planning is, of course, on the ESP8266EX.
Many of the pins have a fixed purpose like the power supply, connections to an antenna or a crystal oscillator etc.
Admittedly, also the power supply offers a wide range of options, but nonetheless, the assignments of the GPIO's should be done first.

################

GPIO 16 must be connected to the EXT\_RSTB pin of the ESP8266EX to be able to wakeup from deep sleep again.
-->


Battery Power Supply
--------------------

We will use a Nitecore NL147[^battery] rechargeable Li-Ion battery as a power supply to enable mobile usage of the board.
It has the size of a usual AA battery and a nominal voltage of 3.7 V.
The special thing about this battery are the "integrated battery overcharge / discharge protection circuits".
With these, we don't need to care about overcharge / discharge protection in our application.

![Nitecore NL147 Li-Ion Battery](/media/liot_esp8266_env/hardware/planning/nl147-image.png)
*Nitecore NL147 Li-Ion Battery [^battery]*

As the battery voltage fluctuates between 4.2 V at full charge and about 3.4 V at full discharge, but the ESP8266EX is only tolerant to voltages of 3.0 to 3.6 V, a voltage regulator is required.

<!--
<http://www.ti.com/product/TPS737>
-->

![Texas Instruments TPS737 LDO Regulator](/media/liot_esp8266_env/hardware/planning/tps737-image.jpg)
*Texas Instruments TPS737 LDO Regulator [^tps737-datasheet]*

...


Serial Flash Memory
-------------------

As it is stated in the datasheet, the "ESP8266EX uses external SPI flash to store user programs, and supports up to 16 Mbytes memory capacity theoretically"[^esp8266ex-datasheet].

The ESP8266EX supports different types of serial flash memories, but there is no further information in the datasheet.
You can use serial flash memories that support "Standard, Dual or Quad SPI" modes.
We will use the Winbond W25Q128FV (16 MB) in order to have the maximum possible memory size.

The W25Q128FV is connected to the pins 18 to 23 which serve as SPI clock, MISO (master in slave out), MOSI (master out slave in), hold, write protect and chip select 0.
Hold and write protect are misused as additional data lines in the "Quad SPI" mode (which is the fastest SPI mode available).
The other two chip select pins should not be used for connecting other SPI slaves to avoid a misbehavior / performance loss of the flash memory.

![Winbond W25Q128 Pin Configuration](/media/liot_esp8266_env/hardware/planning/w25q128-pinout.png)
*Winbond W25Q128 Pin Configuration [^w25q128-datasheet]*

The actual connection is straight-forward, simply connect them as shown in the following table.
 
![LIOT_ESP8266_ENV Pin Assignment for W25Q128](/media/liot_esp8266_env/hardware/planning/liot_esp8266_env-pin-assignment-flash.png)
*LIOT_ESP8266_ENV Pin Assignment for W25Q128*


USB-to-Serial Converter
-----------------------

A USB-to-serial converter is needed in order to be able to flash a firmware to the serial flash memory.
The most popular one is FTDIs FT232R, which is very customizable and has a price of about 4.00 USD.
But also Silicon Labs' CP2102 with a price of about 2.50 USD is very reliable and widely used.
We will use the CP2102 as it is sufficient for our needs.

![CP2102 Connection Diagram](/media/liot_esp8266_env/hardware/planning/cp2102-connection.png){:width="70%"}
*CP2102 Connection Diagram [^cp2102-datasheet]*

The connection diagram may look very complicated, mainly due the different options that are displayed.
But basically it has only to be connected to the USB connector as shown on the left side.
On the right side - for this moment - we are only interested in the TXD and RXD pins.

TXD stands for transmit, RXD stands for receive.
Also the ESP8266EX has these TXD and RXD pins, both for UART0 and UART1, but we will use the default UART0 interface.
If you want to connect the CP2102 with the ESP8266EX, you have to cross the pins.
This means that TXD of the CP2102 has to be connected to the RXD of the ESP8266EX (pin 25) and RXD of the CP2102 has to be connected to the TXD of the ESP8266EX (pin 26).

In UART mode, the TXD pin of UART0 switches to pin 14, but we will not use the UART while in UART mode.

So, the following connections can be taken to the assignment table:
 
![LIOT_ESP8266_ENV Pin Assignment for UART](/media/liot_esp8266_env/hardware/planning/liot_esp8266_env-pin-assignment-uart.png)
*LIOT_ESP8266_ENV Pin Assignment for UART*


Boot Mode Selection
-------------------

Although the information can be found in the internet, that the ESP8266EX has three boot modes[^esp8266ex-boot-modes] - one for flash programming (UART mode), one for booting from SPI flash memory (flash mode) and one for booting from SD card (SDIO mode) - this has never been confirmed by Espressif.
Confusingly, Espressif never explicitly published a table for the "strapping pins" of the ESP8266EX that are used to determine the boot mode at start-up.

![ESP8266EX Boot Modes](/media/liot_esp8266_env/hardware/planning/esp8266ex-boot-modes.png)
*ESP8266EX Boot Modes [^esp8266ex-boot-modes]*

As the third - SDIO mode - does not seem to work, we will only use the other two boot modes.
For these, MTDO always has to be low at startup (reset) and GPIO2 has to be low.
Thus, we will connect a pull-down resistor to MTDO and a pull-up resistor to GPIO2 later.

There are two possibilities to set the state of GPIO0 and to trigger a reset.
On the one hand, this could be done by pressing two buttons.
Then, first the GPIO0 button has to be held down while the reset button is pressed to enter the UART mode.
On the other hand, the DTR (data terminal ready) and RTS (read to send) lines of the USB-to-serial converter can be misused to set the right boot mode.
The NodeMCU devkit project[^github-nodemcu-devkit] developed the following circuit that does this.

![NodeMCU Devkit Auto Program Circuit](/media/liot_esp8266_env/hardware/planning/nodemcu-autoprogram.png)
*NodeMCU Devkit Auto Program Circuit [^nodemcu-devkit]*

We will use both, the buttons and the auto program circuit.


I/O Port Expander
-----------------

So, only the four GPIO's 0, 2, 4 and 5 remain for free decisions.
Two pins will be needed for the use of software-I2C and thus connect the I2C slaves.
Furthermore, a possibility to receive interrupts from the slave devices port expander, nine-axis sensor and environmental sensor is needed as well as the possibility to reset the port expander.
The signaler needs a PWM signal and for all three LED's it would also be nice to be able to use PWM.
This would normally require ~10 more GPIO pins.


868 MHz Transceiver
-------------------

The other SPI interface - HSPI - is provided by the GPIO's from 12 to 15 which serve as MISO, MOSI, clock and chip select (in this order again).
Regrettably, there are no other chip select pins for HSPI so that only one devices can be connected, which will be the sub-1GHz RF transceiver CC1101.
In order to avoid interference and to be able to communicate with the transceiver durably, these GPIO pins should not connected differently.
Moreover, the use of a pull down resistor on chip select is recommended to avoid floating states.
This can be done as there is only one slave device.


Environmental Sensor
--------------------




Inertial Measurement Unit
-------------------------



Other Components
----------------

<!--
The requirement for dimmable LED's may be waived foremost.
Instead, they will be connected to the port expander to simply switch them on and off.
Pins 4 and 5 will be used for software-I2C.
The two remaining GPIO pins will be needed to reset the port expander and receive interrupts from it.
The port expander will always fire interrupts if the state of an input changes.
This eliminates the need for further interrupt enabled GPIO's on the ESP8266EX.

In order to get in the signaler, a trick will be used.
The signaler will be connected to the I2C clock line via a transistor.
Since the I2C interface will be implemented only by software, it can be achieved to obtain mutual exclusion of both components;
the signaler will only be enabled if the transistor is switched on by a GPIO of the port expander and thus will not make any noise if I2C is used, and the I2C slaves will not receive any data when the signaler is used and thus ignore the false "clock signal".
-->


LIOT_ESP8266_ENV
----------------

![LIOT_ESP8266_ENV Pin Assignment](/media/liot_esp8266_env/hardware/planning/liot_esp8266_env-pin-assignment.png)
*LIOT_ESP8266_ENV Pin Assignment [^pin-assignment]*


References
----------

[^esp8266ex-datasheet]: [Espressif - ESP8266EX Datasheet](/media/liot_esp8266_env/documents/esp8266ex-datasheet.pdf)

[^pin-description]: [LIOT - ESP8266EX Pin Description List (Excel)](/media/liot_esp8266_env/documents/esp8266ex-pin-description.xlsx)

[^battery]: [Nitecore - NL147 Li-Ion Battery](http://charger.nitecore.com/product/14500-li-ion-battery-nl147)

[^tps737-datasheet]: [Texas Instruments - TPS737 LDO Regulator](/media/liot_esp8266_env/documents/tps737-datasheet.pdf)

[^w25q128-datasheet]: [Winbond - W25Q128 Datasheet](/media/liot_esp8266_env/documents/w25q128-datasheet.pdf)

[^esp8266ex-boot-modes]: [GitHub - ESP8266 Wiki - Boot Process (ESP Boot Modes)](https://github.com/esp8266/esp8266-wiki/wiki/Boot-Process#esp-boot-modes)

[^github-nodemcu-devkit]: [GitHub - NodeMCU Devkit V1.0](https://github.com/nodemcu/nodemcu-devkit-v1.0)

[^nodemcu-devkit]: [NodeMCU - Devkit V1.0](/media/liot_esp8266_env/documents/nodemcu-devkit-v1.0.pdf)

[^cp2102-datasheet]: [Silicon Labs - CP2102/09 Datasheet](/media/liot_esp8266_env/documents/cp2102-datasheet.pdf)

[^tca6316a-datasheet]: [Texas Instruments - TCA6416A Datasheet](/media/liot_esp8266_env/documents/tca6416a-datasheet.pdf)

[^bme280-datasheet]: [Bosch Sensortec - BME280 Datasheet](/media/liot_esp8266_env/documents/bme280-datasheet.pdf)

[^bno055-datasheet]: [Bosch Sensortec - BNO055 Datasheet](/media/liot_esp8266_env/documents/bno055-datasheet.pdf)

[^pin-assignment]: [LIOT - LIOT_ESP8266_ENV Pin Assignment List (Excel)](/media/liot_esp8266_env/documents/liot_esp8266_env-pin-assignment.xlsx)

<!-- http://ip.cadence.com/news/243/330/Tensilica-Unveils-Diamond-Standard-106Micro-Processor-Smallest-Licensable-32-bit-Core -->