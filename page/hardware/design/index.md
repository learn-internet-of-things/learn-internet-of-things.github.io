---
layout: default
title: Design
---

| Pin | Name        | Type | Description / Main Application                     | GPIO   | SPI   | HSPI  | UART      | I2S      | Misc       |
| ---:| ----------- | ---- | -------------------------------------------------- | ------ | ----- | ----- | --------- | -------- | ---------- |
|   1 | VDDA        | P    | Analog Power 3.0V ~ 3.6V                           |        |       |       |           |          |            |
|   2 | LNA         | I/O  | RF Antenna Interface, 50Ω Impedance                |        |       |       |           |          |            |
|   3 | VDD3P3      | P    | Amplifier Power 3.0V ~ 3.6V                        |        |       |       |           |          |            |
|   4 | VDD3P3      | P    | Amplifier Power 3.0V ~ 3.6V                        |        |       |       |           |          |            |
|   5 | VDD_RTC     | P    | NC (1.1V)                                          |        |       |       |           |          |            |
|   6 | TOUT        | I    | ADC Pin (internal)                                 |        |       |       |           |          |            |
|   7 | CHIP_PU     | I    | Chip Enable (High: On, Low: Off w/ small current)  |        |       |       |           |          |            |
|   8 | XPD_DCDC    | I/O  | Deep-Sleep Wakeup                                  | GPIO16 |       |       |           |          |            |
|   9 | MTMS        | I/O  | HSPI Clock                                         | GPIO14 |       | CLK   | UART0_DSR | I2SI_WS  |            |
|  10 | MTDI        | I/O  | HSPI Master In Slave Out                           | GPIO12 |       | MISO  | UART0_DTR | I2SI_SD  |            |
|  11 | VDDPST      | P    | Digital/IO Power Supply (1.8V ~ 3.3V)              |        |       |       |           |          |            |
|  12 | MTCK        | I/O  | HSPI Data Master Out Slave In,                     | GPIO13 |       | MOSI  | UART0_CTS | I2SI_SCK |            |
|  13 | MTDO        | I/O  | HSPI Chip Select,                                  | GPIO15 |       | /CS   | UART0_RTS | I2SO_SCK |            |
|  14 | GPIO2       | I/O  | General Purpose Input / Output                     | GPIO2  |       |       | *         | I2SO_WS  |            |
|  15 | GPIO0       | I/O  | General Purpose Input / Output                     | GPIO0  | /CS2  |       |           |          |            |
|  16 | GPIO4       | I/O  | General Purpose Input / Output                     | GPIO4  |       |       |           |          | CLK_XTAL   |
|  17 | VDDPST      | P    | Digital/IO Power Supply (1.8V ~ 3.3V)              |        |       |       |           |          |            |
|  18 | SDIO_DATA_2 | I/O  | SPI / HSPI Hold                                    | GPIO9  | /HOLD | /HOLD |           |          |            |
|  19 | SDIO_DATA_3 | I/O  | SPI / HSPI Write Protect                           | GPIO10 | /WP   | /WP   |           |          |            |
|  20 | SDIO_CMD    | I/O  | SPI Chip Select 0                                  | GPIO11 | /CS0  |       | UART1_RTS |          |            |
|  21 | SDIO_CLK    | I/O  | SPI Clock                                          | GPIO6  | CLK   |       | UART1_CTS |          |            |
|  22 | SDIO_DATA_0 | I/O  | SPI Data Master In Slave Out, UART1 Transmit       | GPIO7  | MISO  |       | UART1_TXD |          |            |
|  23 | SDIO_DATA_1 | I/O  | SPI Data Master Out Slave In, UART1 Receive        | GPIO8  | MOSI  |       | UART1_RXD |          |            |
|  24 | GPIO5       | I/O  | General Purpose Input / Output                     | GPIO5  |       |       |           |          | CLK_RTC    |
|  25 | U0RXD       | I/O  | UART0 Receive                                      | GPIO3  |       |       | UART0_RXD | I2SO_SD  | CLK_XTAL   |
|  26 | U0TXD       | I/O  | UART0 Transmit                                     | GPIO1  | /CS1  |       | UART0_TXD |          | CLK_RTC    |
|  27 | XTAL_OUT    | I/O  | Crystal oscillator output                          |        |       |       |           |          |            |
|  28 | XTAL_IN     | I/O  | Crystal oscillator input                           |        |       |       |           |          |            |
|  29 | VDDD        | P    | Analog Power 3.0V ~ 3.6V                           |        |       |       |           |          |            |
|  30 | VDDA        | P    | Analog Power 3.0V ~ 3.6V                           |        |       |       |           |          |            |
|  31 | RES12K      | I    | Series with 12 kΩ resistor connected to ground     |        |       |       |           |          |            |
|  32 | EXT_RSTB    | I    | External reset signal (Low: Active)                |        |       |       |           |          |            |

* UART0_TXD / UART1_TXD during flash programming