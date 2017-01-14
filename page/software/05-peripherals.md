---
layout: page
title: Peripherals
permalink: /software/peripherals/
---

Port Expander
-------------

Based on the self-written I²C driver, the first driver for one of the I2C slaves can be implemented.
The TCA6416A I/O expander is well suited because it only has four registers for each port line that are very easy to use.
Besides, turning on an LED is a very vivid indication that the communication was successful.

The address for the TCA6416A is `0x20` if the address input is `low` and `0x21` if it is `high`.

There are four registers for each port line that are used to read an port `input` value, set a port `output` value, set `polarity inversion` of an input or set the `configuration` of a port either as an input or an output.
Except the input register that can only be read, each register can be written to or read from.
In order to avoid reading the state of a register often, the value that is written to a register should also be stored locally on the microcontroller (there are no other slaves that could change values)..

To write to or read from a specific register, the register address has to be written first.
The register address of the `output` register of `port line 0` for example is `0x02` (see the following image).

![TCA6416A Command Bytes](/media/liot_esp8266_env/software/peripherals/tca6416a-command-bytes.png)
*TCA6416A Command Bytes [^tca6316a-datasheet]*

Self-explanatory, a bit value of `1` of an input or an output means `high` (and `0` means `low`).
In the configuration register, a `1` sets the port as an input and a `0` sets it as an output.
The values of the `polarity inversion` register are not needed here.
Using this information, we can already define the following macros for the TCA6416A driver header file:

```c
#ifndef TCA6416A_H
#define TCA6416A_H

#include "driver/soft_i2c.h"

#define TCA6416A_ADDR_LOW         0x20
#define TCA6416A_ADDR_HIGH        0x21

#define TCA6416A_REG_INPUT_0      0x00
#define TCA6416A_REG_INPUT_1      0x01
#define TCA6416A_REG_OUTPUT_0     0x02
#define TCA6416A_REG_OUTPUT_1     0x03
#define TCA6416A_REG_POL_INV_0    0x04
#define TCA6416A_REG_POL_INV_1    0x05
#define TCA6416A_REG_CONFIG_0     0x06
#define TCA6416A_REG_CONFIG_1     0x07

#define TCA6416A_GPIO_IN          0x01
#define TCA6416A_GPIO_OUT         0x00

#define TCA6416A_GPIO_IN          0x01
#define TCA6416A_GPIO_OUT         0x00

typedef enum {
    TCA6416A_P0 = 0x0,
    TCA6416A_P1 = 0x1
} TCA6416A_port;

// ...

#endif
```
    
To set `P0.3` to `high`, the corresponding control register bit `B3` has to be set to `1`.
It is not possible to write only a single bit and you may not want to change the other values of `port line 0`, so you may want to get the current state first.
We want to store these states locally, so we have to know the the default values of the registers, that are also shown in the image above.
In order to get a consistent state of the local register values, the TCA6416A should always be reset, when it is initialized, so that the local states matches the default values of the TCA6416A after its restart.

To prove that the communication with an I2C slave is successful, a certain register can be read out.
Many I2C slaves have a register with a chip identification number (ID), that can be compared to the given value from the datasheet to ensure the successful communication with the slave and the expected device, respectively, and not with any other.
Certainly, the TCA6416A has no such ID register, so that the default value of the `polarity inversion` that is `0x00` will be used as a proof that communication is working.
If the communication would have been unsuccessful, the data line would only be pulled high which results in the "answer" `0xFF`.

The resulting code for the initialization and reset routines is:

```c
void TCA6416A_init(
        uint8 address)
{
    // set GPIO 0 as reset pin for the TCA6416A
    PIN_FUNC_SELECT(PERIPHS_IO_MUX_GPIO0_U, FUNC_GPIO0);
    GPIO_OUTPUT_SET(0, GPIO_HIGH);

    TCA6416A_reset();

    // there is no ID register, so try to read another default value
    if (I2C_read_single(address, TCA6416A_REG_POL_INV_0) != 0x00) {
        return;
    }

    _address = address;

    // set local states to default values
    TCA6416A_state_output[TCA6416A_P0] = 0xFF;
    TCA6416A_state_output[TCA6416A_P1] = 0xFF;
    TCA6416A_state_polinv[TCA6416A_P0] = 0x00;
    TCA6416A_state_polinv[TCA6416A_P1] = 0x00;
    TCA6416A_state_config[TCA6416A_P0] = 0xFF;
    TCA6416A_state_config[TCA6416A_P1] = 0xFF;
}

void TCA6416A_reset()
{
    os_delay_us(10);
    GPIO_OUTPUT_SET(0, GPIO_LOW);
    os_delay_us(10);
    GPIO_OUTPUT_SET(0, GPIO_HIGH);
}
```

In order to turn on one of the LED's (the one that is on `P0.5` for example), the port has to set as an `output` (`0`) and `low` (`0`) to sink current.
As you want to avoid setting the port to an "undefined" value, you should set the output value first before configuring the port as an output.

When setting bit `B5` to `0`, we need to respect the current values of the other bits.
Set every bit of the mask byte to `1`, except bit 5 that is set to `0`.
Use the `bitwise and` operator for this mask byte and the current state to caluculate the command byte that should be written to the register.

```
    7 6 5 4 3 2 1 0

    1 1 0 1 1 1 1 1 (mask for P0.5)
AND X X X X X X X X (current state)
-------------------
    X X 0 X X X X X (new state)
```

Note that all values will keep their state (because `X & 1 = X`), except for `B5` that will change to `0` (because `X & 0 = 0`.
If you would want to set `B5` to `1`, you would use the `bitwise or` operator and the values `0` instead.

Do the same for the configuration variable to set `B5` as an output.
Now you can write the new state (that is stored in `TCA6416A_state_output[TCA6416A_P0]` and `TCA6416A_state_config[TCA6416A_P0]` to the corresponding registers.

The code looks as follows:

```c
I2C_write_single(_address, TCA6416A_REG_OUTPUT_0,
        TCA6416A_state_output[TCA6416A_P0]);
I2C_write_single(_address, TCA6416A_REG_CONFIG_0,
        TCA6416A_state_config[TCA6416A_P0]);
```

This approach can be used to implement input (or output) methods that only take a mask of pins (and the output value) as an argument and do this logic on its own.

```c
void TCA6416A_set_outputs(
        uint16 pins,
        uint8 level)
{
    // in conf register, 1 is input, 0 is output
    // set as outputs as follows:
    // - invert pins variable, then AND with TCA6416A_state_config
    // existing outputs will stay outputs, new will become outputs with AND
    TCA6416A_state_config[TCA6416A_P0] &= ~(pins);
    TCA6416A_state_config[TCA6416A_P1] &= ~(pins >> 8);

    if (level == 0) {
        // in output register, 1 is high, 0 is low
        // set low as follows:
        // - inverts pins variable, then AND with TCA6416A_state_output
        // low will stay low, high will change if it should
        TCA6416A_state_output[TCA6416A_P0] &= ~(pins);
        TCA6416A_state_output[TCA6416A_P1] &= ~(pins >> 8);
    } else {
        // in output register, 1 is high, 0 is low
        // set high as follows:
        // - simply OR with TCA6416A_state_output
        // high will stay high, low will change if it should
        TCA6416A_state_output[TCA6416A_P0] |= (pins);
        TCA6416A_state_output[TCA6416A_P1] |= (pins >> 8);
    }

    TCA6416A_update_outputs();
}

static void TCA6416A_update_outputs()
{
    I2C_write_single(_address, TCA6416A_REG_CONFIG_0,
            TCA6416A_state_config[TCA6416A_P0]);
    I2C_write_single(_address, TCA6416A_REG_CONFIG_1,
            TCA6416A_state_config[TCA6416A_P1]);
    I2C_write_single(_address, TCA6416A_REG_OUTPUT_0,
            TCA6416A_state_output[TCA6416A_P0]);
    I2C_write_single(_address, TCA6416A_REG_OUTPUT_1,
            TCA6416A_state_output[TCA6416A_P1]);
}
```

The full TCA6416A driver can be found here:

* [tca6416a.h](https://github.com/liotio/liot_esp8266_env/blob/master/include/driver/tca6416a.h)
* [tca6416a.c](https://github.com/liotio/liot_esp8266_env/blob/master/driver/tca6416a.c)

Environmental Sensor
--------------------

The BME280 environmental sensor is, compared to the TCA6416A I/O expander, already considerably more complex to configure.
In addition to the different operating modes "sleep", "normal" and "forced", there are options for oversampling to reduce the measurement noise, or filters to reduce the impact of sudden events like opening a window.
All these parameters make the use of the sensor more difficult, but allow to very precisely adapt own needs and to reduce the power consumption to extremely low levels.
In addition, 18 fixed calibration values (in subsequent code prefixed with `dig_`) must be read from the sensor, with which the raw data must be set off, in order to obtain the actual measurement results.

![BME280 Environmental Sensor](/media/liot_esp8266_env/software/peripherals/bme280-image.png)
*BME280 Environmental Sensor [^bme280-datasheet]*

However, the configuration of the sensor is to be kept simple.
It is to be used in the normal operating mode without oversampling or filters, in which every 1000 ms a measurement of all three dimensions is performed.
The data is then written into corresponding registers and then the sensor is put into sleep mode, until the next measurement.
The related initializing routine is shown in the following code.

```c
void BME280_init(uint8 address)
{
    if (I2C_read_single(address, BME280_REG_ID) != BME280_ID) {
        return;
    }

    _address = address;

    I2C_write_single(_address, BME280_REG_CTRL_HUM,
            BME280_OVERSAMPL_HUM_X01);

    I2C_write_single(_address, BME280_REG_CTRL_MEAS,
            BME280_MODE_NORMAL |
            BME280_OVERSAMPL_TEM_X01 |
            BME280_OVERSAMPL_PRS_X01);

    I2C_write_single(_address, BME280_REG_CONFIG,
            BME280_T_STANDBY_MS_1000);

    dig_T1 = (uint16) I2C_read_multiple_lsb(_address, BME280_REG_DIG_T1_LSB, 16);
    // ...
    dig_H6 = (sint8)  I2C_read_multiple_msb(_address, BME280_REG_DIG_H6_MSB,  8);
}
```

For example, in order to calculate the temperature, the raw data must be read from the corresponding registers.
This analog value must then be cast in accordance to the datasheet.
Afterwards, only the calculation code has to be copied from the datasheet.
In order to avoid replacing the data types like BME280 S32 t, corresponding type definitions should be used.
See the following code for temperature calculation.

```c
sint32 BME280_get_temperature_int32()
{
    uint32 data;
    sint32 adc_T;

    data = I2C_read_multiple_msb(_address, BME280_REG_TEMP_MSB, 20);

    #ifdef DEBUG
    os_printf("\ndata:   %u", data);
    os_printf("\ndig_T1: %u", dig_T1);
    os_printf("\ndig_T2: %d", dig_T2);
    os_printf("\ndig_T3: %d", dig_T3);
    #endif

    adc_T = (sint32) data;

    // Code from Datasheet, formatted by Eclipse

    BME280_S32_t var1, var2;
    var1 = ((((adc_T >> 3) - ((BME280_S32_t) dig_T1 << 1)))
            * ((BME280_S32_t) dig_T2)) >> 11;
    var2 = (((((adc_T >> 4) - ((BME280_S32_t) dig_T1))
            * ((adc_T >> 4) - ((BME280_S32_t) dig_T1))) >> 12)
            * ((BME280_S32_t) dig_T3)) >> 14;
    t_fine = var1 + var2;
    BME280_temp_sint = (t_fine * 5 + 128) >> 8;
    return BME280_temp_sint;
}
```

The return type of the above method is an integer, although the represented value is a fixed-point number.
So, a return value of 2387 represents a temperature value of 23.87 °C.
There is also a calculation variant that is returning a floating point number, but the ESP8266EX does not support the output of floating point numbers via methods like printf or sprintf.
For this reason, it is even preferable to use an integer result, and split it into pre-decimal point position and decimal place.
These individual and also integer values can then be assembled to a xed-point number for output.

The full BME280 driver can be found here:

* [bme280.h](https://github.com/liotio/liot_esp8266_env/blob/master/include/driver/bme280.h)
* [bme280.c](https://github.com/liotio/liot_esp8266_env/blob/master/driver/bme280.c)

Inertial Measurement Unit
-------------------------

The BNO055 inertial measurement unit can calculate fused sensor data like quaternions, Euler angles, rotation vectors etc. on its own, so that there is no need to deal with raw sensor data and calibration values anymore.
This results in a higher eort for the more abstract initialization conguration, but then facilitates the actual data readout.

![BNO055 Inertial Measurement Unit](/media/liot_esp8266_env/software/peripherals/bno055-image.png)
*BME280 Inertial Measurement Unit [^bno055-datasheet]*

The following code shows how to bring the sensor into configuration mode, reset the device, set units to default values (Windows instead of Android orientation mode, Celsius instead of Fahrenheit, degrees instead of radians, dps instead of rps and m/s² instead of mg), and select the normal power and the IMU operation mode.

```c
void BNO055_init(
        uint8 address)
{
    if (I2C_read_single(address, BNO055_REG_ID) != BNOO055_ID) {
        return;
    }

    _address = address;

    // start config mode
    I2C_write_single(_address, BNO055_REG_PAGE_ID, 0);
    I2C_write_single(_address, BNO055_REG_OPR_MODE, BNO055_MODE_OP_CFG);
    I2C_write_single(_address, BNO055_REG_SYS_TRIGGER, 0x80);
    I2C_write_single(_address, BNO055_REG_UNIT_SEL, 0);
    I2C_write_single(_address, BNO055_REG_PWR_MODE, BNO055_MODE_PWR_NORMAL);
    I2C_write_single(_address, BNO055_REG_OPR_MODE, BNO055_MODE_OP_IMU);
}
```

Then, for example, the three 16 bit Euler angles can be read out directly, in this case shifted into a 64 bit integer.

```
uint64 BNO055_read_euler()
{
    // get bits in right order, but first pitch, then roll, last head
    return I2C_read_multiple_lsb(_address, BNO055_REG_EUL_HEAD_L, 48);
}
```

The full BNO055 driver can be found here:

* [bno055.h](https://github.com/liotio/liot_esp8266_env/blob/master/include/driver/bno055.h)
* [bno055.c](https://github.com/liotio/liot_esp8266_env/blob/master/driver/bno055.c)

Sub-1 GHz RF-Transceiver
------------------------

![CC1101 Sub-1 GHz RF-Transceiver](/media/liot_esp8266_env/software/peripherals/cc1101-image.jpg)
*CC1101 Sub-1 GHz RF-Transceiver*

...

The full CC1101 driver can be found here:

* [cc1101.h](https://github.com/liotio/liot_esp8266_env/blob/master/include/driver/cc1101.h)
* [cc1101.c](https://github.com/liotio/liot_esp8266_env/blob/master/driver/cc1101.c)


References
----------

[^li-ion]: [Wikipedia - Lithium-Ion Battery](https://en.wikipedia.org/wiki/Lithium-ion_battery)

[^tca6316a-datasheet]: [Texas Instruments - TCA6416A Datasheet](/media/liot_esp8266_env/liot_esp8266_env/documents/tca6416a-datasheet.pdf)

[^bme280-datasheet]: [Bosch Sensortec - BME280 Datasheet](/media/liot_esp8266_env/documents/bme280-datasheet.pdf)

[^bno055-datasheet]: [Bosch Sensortec - BNO055 Datasheet](/media/liot_esp8266_env/documents/bno055-datasheet.pdf)