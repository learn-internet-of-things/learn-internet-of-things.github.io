---
layout: page
title: Hardware Planning
permalink: /hardware/planning/
---

If you are used to program usual computer or smartphone apps, web applications or comparable software, you are probably used to try things out until they start to work.
When dealing with hardware dependent programming, this might become already a bit risky, because you could make an irrevocable error that prevents you from undoing that failure again, although the hardware is possibly still intact.
Then, you are forced to switch to a lower level to remedy the defect for example.
But if you are planning and assembling some hardware, you must not make any mistakes or you might destroy your new IC's or get a set of useless PCB's.
So take your time.

At the same time, this does not mean that you are not allowed to build prototypes on a matrix board or a breadboard.
But if you do that because things are not clear, a preferable way might be to find existing and working similar solutions in the internet.


Hardware Specification
--------------------------------

A good start is to have a clear overview over the capabilities of the hardware that should be used.
In general one needs to know what peripherals should be used to find a microprocessor that meets the requirements.
In this case, the microprocessor ESP8266 is chosen mainly due to its unbeatable price and its Wi-Fi support.
The fact that it is capable to meet our requirements is anticipated, you will get an idea of how to find a processor for your requirements anyway.
You can find more details for the reasons choosing this device in the master's thesis in the download section.

The ESP8266 is a bit complicated in gathering all the needed data because Espressif Systems, the manufactor of the chip, keeps itself covered or omits a lot of documentation.
This is bothersome on the one hand, but helps to reflect on the important things.

You will find the information that the chip "integrates an enhanced version of Tensilica’s L106 Diamond series 32 bit processor" that is running normally at a speed of 80 MHz.
Cadence, that is the new name of the Tensilica processors manufacturer, declares them as "based on an industry-standard architecture" and "smaller than the ARM7 or Cortex-M3 cores" based on the chosen manufacturing process.
Absolute values for the provided memory are hard to find.
The chip possibly includes 64 KB of instruction RAM, 96 KB of data RAM and 64 KB of ROM.
Around 50 KB of these are accessible in heap and data section when ESP8266 is working under the station mode and is connected to the router.
The ROM is not programmable, therefore, user programs must be stored in an external SPI flash that can have a size up to 16 MB (128 Mbit).

Furthermore the chip has 16 GPIO's that are multiplexed with other functions like PWM, SDIO, SPI, UART or I2S.

For a complete list, you can see the table below, that is mainly taken from the ESP8266EX datasheet.
The pin description is fitted a bit to the applications that are really used.

![ESP8266EX Pin Description](/media/liot_esp8266_env/documents/esp8266ex-pin-description.png)
*ESP8266EX Pin Description [^pin-description]*


* UART0_TXD / UART1_TXD during flash programming

Planning the LIOT-ESP8266
-------------------------

The first focus of the board planning is, of course, on the ESP8266EX.
Many of the pins have a fixed purpose like the power supply, connections to an antenna or a crystal oscillator etc.
Admittedly, also the power supply offers a wide range of options, but nonetheless, the assignments of the GPIO's should be done first.

As already mentioned, the ESP8266EX has 16 GPIO's that are multiplexed with other functions.
For this reason, some of those have already a fixed purpose.

GPIO 3 will always be needed for UART receive and GPIO 1 is used for UART transmit while in normal operation.
When the chip is in programming mode, GPIO 2 serves as the UART transmit pin, but this will not be needed and thus GPIO 2 will continue to be used for other tasks available.
So, the single purpose of GPIO's 1 and 3 will be the connection to the USB-to-serial converter CP2102.

The external flash memory W25Q32FV respectively W25Q128FV is connected to the GPIO's from 6 to 11 which serve as SPI clock, MISO, MOSI, hold, write protect and chip select 0 (in this order).
Hold and write protect are misused to increase the write speed by providing the ``Quad IO'' mode.
The other two chip select pins should not be used for connecting other SPI slaves to avoid a misbehavior with the flash.

The other SPI interface - HSPI - is provided by the GPIO's from 12 to 15 which serve as MISO, MOSI, clock and chip select (in this order again).
Regrettably, there are no other chip select pins for HSPI so that only one devices can be connected, which will be the sub-1GHz RF transceiver CC1101.
In order to avoid interference and to be able to communicate with the transceiver durably, these GPIO pins should not connected differently.
Moreover, the use of a pull down resistor on chip select is recommended to avoid floating states.
This can be done as there is only one slave device.

Finally, GPIO 16 must be connected to the EXT\_RSTB pin of the ESP8266EX to be able to wakeup from deep sleep again.

So, only the four GPIO's 0, 2, 4 and 5 remain for free decisions.
Two pins will be needed for the use of software-I2C and thus connect the I2C slaves.
Furthermore, a possibility to receive interrupts from the slave devices port expander, nine-axis sensor and environmental sensor is needed as well as the possibility to reset the port expander.
The signaler needs a PWM signal and for all three LED's it would also be nice to be able to use PWM.
This would normally require ~10 more GPIO pins.

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

It doesn't really matter what the LIOT-ESP8266 board can do.
Rather, it is relevant what concepts are covered by the selected components.
These concepts include electrotechnical basics, connection interfaces, transmission standards and other features supported by the used hardware.

Interfaces: USART, SPI, I2C, I2S

RF: Sub-1-Ghz (Sigfox), Wi-Fi, Bluetooth, GSM

GPIO, Timers, RTC, PWM, ADC, DAC, SDIO, ...
 
![LIOT_ESP8266_ENV Pin Assignment](/media/liot_esp8266_env/documents/liot_esp8266_env-pin-assignment.png)
*LIOT_ESP8266_ENV Pin Assignment [^pin-assignment]*


References
----------

[^pin-description]: [LIOT - ESP8266EX Pin Description List (Excel)](/media/liot_esp8266_env/documents/esp8266ex-pin-description.xlsx)

[^pin-assignment]: [LIOT - LIOT_ESP8266_ENV Pin Assignment List (Excel)](/media/liot_esp8266_env/documents/liot_esp8266_env-pin-assignment.xlsx)

<!-- http://ip.cadence.com/news/243/330/Tensilica-Unveils-Diamond-Standard-106Micro-Processor-Smallest-Licensable-32-bit-Core -->