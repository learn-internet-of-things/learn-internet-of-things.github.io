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

![TCA6416A Command Bytes](/media/software/peripherals/tca6416a-command-bytes.png)
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
I2C_write_single(_address, TCA6416A_REG_OUTPUT_0, TCA6416A_state_output[TCA6416A_P0]);
I2C_write_single(_address, TCA6416A_REG_CONFIG_0, TCA6416A_state_config[TCA6416A_P0]);
```

This approach can be used to implement input (or output) methods that only take a mask of pins (and the output value) as an argument and do this logic on its own.

The full TCA6416A driver can be found here:

* [tca6416a.h](https://github.com/liotio/liot_esp8266_env/blob/master/include/driver/tca6416a.h)
* [tca6416a.c](https://github.com/liotio/liot_esp8266_env/blob/master/driver/tca6416a.c)

Temperature / Humidity Sensor
-----------------------------

(BME280)

...

Inertial Measurement Unit
-------------------------

(BNO055)

...

Sub-1 GHz RF-Transceiver
------------------------

(CC1101)

...


References
----------

[^li-ion]: [Wikipedia - Lithium-Ion Battery](https://en.wikipedia.org/wiki/Lithium-ion_battery)

[^tca6316a-datasheet]: [Texas Instruments - TCA6416A Datasheet](/media/liot_esp8266_env/datasheets/tca6416a-datasheet.pdf)