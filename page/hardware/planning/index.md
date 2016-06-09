---
layout: default
title: Planning
---

Planning the Hardware
=====================

...

| Pin | Name        | Type | GPIO       | SPI       | HSPI      | UART       | I2S      | Misc         | W25Q128   | CP2102    | Si4463   | PCA6416A   | I2C Slaves¹ | Piezo | RGB-LED |
| ---:| ----------- | ---- | ---------- | --------- | --------- | ---------- | -------- | ------------ | --------- | --------- | -------- | --------   | ----------- |       |         |
|   1 | VDDA        | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   2 | LNA         | I/O  |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   3 | VDD3P3      | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   4 | VDD3P3      | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   5 | VDD_RTC     | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   6 | TOUT        | I    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   7 | CHIP_PU     | I    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|   8 | XPD_DCDC    | I/O  | **GPIO16** |           |           |            |          | **EXT_RSTB** |           |           |          |            |             |       |         |
|   9 | MTMS        | I/O  | GPIO14     |           | **CLK**   | U0_DSR     | I2SI_WS  |              |           |           | **SCLK** |            |             |       |         |
|  10 | MTDI        | I/O  | GPIO12     |           | **MISO**  | U0_DTR     | I2SI_SD  |              |           |           | **SDO**  |            |             |       |         |
|  11 | VDDPST      | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  12 | MTCK        | I/O  | GPIO13     |           | **MOSI**  | U0_CTS     | I2SI_SCK |              |           |           | **SDI**  |            |             |       |         |
|  13 | MTDO        | I/O  | GPIO15     |           | **/CS**   | U0_RTS     | I2SO_SCK |              |           |           | **nSEL** |            |             |       |         |
|  14 | GPIO2       | I/O  | **GPIO2**  |           |           | **²**      | I2SO_WS  |              |           |           |          | **/INT**   |             |       |         |
|  15 | GPIO0       | I/O  | **GPIO0**  | /CS2      |           |            |          |              |           | **/RTS²** |          | **/RESET** |             |       |         |
|  16 | GPIO4       | I/O  | **GPIO4**  |           |           |            |          | CLK_XTAL     |           |           |          | **SCK**    | **SCK**     |       |         |
|  17 | VDDPST      | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  18 | SDIO_DATA_2 | I/O  | GPIO9      | **/HOLD** | /HOLD     |            |          |              | **/HOLD** |           |          |            |             |       |         |
|  19 | SDIO_DATA_3 | I/O  | GPIO10     | **/WP**   | /WP       |            |          |              | **/WP**   |           |          |            |             |       |         |
|  20 | SDIO_CMD    | I/O  | GPIO11     | **/CS0**  |           | U1_RTS     |          |              | **/CS**   |           |          |            |             |       |         |
|  21 | SDIO_CLK    | I/O  | GPIO6      | **CLK**   |           | U1_CTS     |          |              | **CLK**   |           |          |            |             |       |         |
|  22 | SDIO_DATA_0 | I/O  | GPIO7      | **MISO**  |           | U1_TXD     |          |              | **DO**    |           |          |            |             |       |         |
|  23 | SDIO_DATA_1 | I/O  | GPIO8      | **MOSI**  |           | U1_RXD     |          |              | **DI**    |           |          |            |             |       |         |
|  24 | GPIO5       | I/O  | **GPIO5**  |           |           |            |          | CLK_RTC      |           |           |          | **SDI**    | **SDI**     |       |         |
|  25 | U0RXD       | I/O  | GPIO3      |           |           | **U0_RXD** | I2SO_SD  | CLK_XTAL     |           | **TXD**   |          |            |             |       |         |
|  26 | U0TXD       | I/O  | GPIO1      | /CS1      |           | **U0_TXD** |          | CLK_RTC      |           | **RXD**   |          |            |             |       |         |
|  27 | XTAL_OUT    | I/O  |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  28 | XTAL_IN     | I/O  |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  29 | VDDD        | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  30 | VDDA        | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  31 | RES12K      | I    |            |           |           |            |          |              |           |           |          |            |             |       |         |
|  32 | EXT_RSTB    | I    |            |           |           |            |          |              |           | **/DTR²** |          |            |             |       |         |
|  33 | GND         | P    |            |           |           |            |          |              |           |           |          |            |             |       |         |

<small>1. I2C slaves are PCA6416A (Port Expander, with extra column), BME280 (Temp / Hum / Baro), BMX055 (Accel / Gyro / Mag), APDS-9930 (Prox / Bright)</small>  
<small>2. during flash programming U0_TXD / U1_TXD, 3. during flash programming</small>

GPIO16 needs to be connected to EXT_RSTB if deep sleep wakeup should be possible

Missing Pins
------------

Si4463: nIRQ

PCA6416A: SCK, SDI, Address-Pins: ADDR(GND = 0x40/0x41, VDD = 0x42/0x43)

BME280: SCK, SDI, Address-Pins: SDO (GND = 0x76, VDD = 0x77)

BMX055: SCx, SDx, Address-Pins: SDO1, SDO2, CSB3 (0x10-0x13, 0x18, 0x19, 0x68, 0x69)

APDS-9930: SCL, SDA, INT

abmt-801 piezo

