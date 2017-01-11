---
layout: page
title: Input / Output
permalink: /software/input-output/
---

Serial Communication
--------------------

The `LIOT_ESP6288_ENV` is planned as a mobile device and there is no specific debugging interface on the board.
For this reason the UART interface, that is needed for firmware flashing, can be used for "debugging" outputs.

The `driver_lib` that is included in the SDK contains the needed UART driver.
To make it available to the project, simply add it to the `EXTRA_SRCS` of the Makefile as shown below.
On this occasion, the speed for firmware flashing can be increased from 115200 to 921600 using the `ESPBAUD` variable.

```
PROGRAM       = liot_esp8266_env
ESPBAUD       = 921600

EXTRA_SRCS    = $(ROOT)/sdk/driver_lib

include $(ESP_EASY_SDK)/common.mk
```

Then, the UART driver can be included.
It provides a method to set the baud rate of one UART interface (the ESP8266 has UART0 and UART1).
In contrast to the flash speed, a baud rate of 115200 is common for serial outputs.
It can be set using the `BIT_RATE_115200` macro.

After setting the baud rate for UART0, the method `os_printf` can be used similar to the standard C `printf` method.
For example, the SDK version can be output programmatically.

```c
#include "osapi.h"
#include "user_interface.h"
#include "driver/uart.h"

#include "user_config.h"

void user_init();
void user_start();

void user_init()
{
    wifi_set_opmode(STATIONAP_MODE);
    UART_SetBaudrate(UART0, BIT_RATE_115200);
    os_printf("SDK version: %s", system_get_sdk_version());
    system_init_done_cb(user_start);
}

void user_start()
{
    // ...
}
```


General-Purpose I/O
-------------------

...[^non-os-sdk-api]

```c
#define GPIO_OUTPUT_SET(gpio_no, bit_value) \
    gpio_output_set((bit_value)<<gpio_no, ((~(bit_value))&0x01)<<gpio_no, 1<<gpio_no,0)
#define GPIO_DIS_OUTPUT(gpio_no) 	gpio_output_set(0,0,0, 1<<gpio_no)
#define GPIO_INPUT_GET(gpio_no)     ((gpio_input_get()>>gpio_no)&BIT0)


/*
 * Change GPIO pin output by setting, clearing, or disabling pins.
 * In general, it is expected that a bit will be set in at most one
 * of these masks.  If a bit is clear in all masks, the output state
 * remains unchanged.
 *
 * There is no particular ordering guaranteed; so if the order of
 * writes is significant, calling code should divide a single call
 * into multiple calls.
 */
void gpio_output_set(uint32 set_mask,
                     uint32 clear_mask,
                     uint32 enable_mask,
                     uint32 disable_mask);

/*
 * Sample the value of GPIO input pins and returns a bitmask.
 */
uint32 gpio_input_get(void);
```

Furthermore, it is possible to decide between the output stages push-pull and open-collector (see [Hardware Interfaces](/hardware/interfaces/#general-purpose-inputoutput).


I2C Driver
----------

Using open-collector, it is possible to write an I2C driver based on GPIO bit-banging.

To improve the readability of the actual driver code, it is advisable to define self-explaining macros.
...

```c
#ifndef SOFT_I2C_H
#define SOFT_I2C_H

#include "c_types.h"
#include "eagle_soc.h"
#include "ets_sys.h"
#include "gpio.h"
#include "osapi.h"

#define GPIO_INPUT      0
#define GPIO_OUTPUT     1

#define GPIO_LOW        0
#define GPIO_HIGH       1

#define I2C_SDA_PIN     2
#define I2C_SCK_PIN     4
#define I2C_SDA_MUX     PERIPHS_IO_MUX_GPIO2_U
#define I2C_SCL_MUX     PERIPHS_IO_MUX_GPIO4_U
#define I2C_SDA_FUNC    FUNC_GPIO2
#define I2C_SCL_FUNC    FUNC_GPIO4

#define I2C_SEND_ACK    0
#define I2C_SEND_NACK   1

#define I2C_SLAVE_WRITE 0
#define I2C_SLAVE_READ  1

#define I2C_SDA_IN      GPIO_DIS_OUTPUT(I2C_SDA_PIN)
#define I2C_SDA_HIGH    GPIO_OUTPUT_SET(I2C_SDA_PIN, GPIO_HIGH)
#define I2C_SDA_LOW     GPIO_OUTPUT_SET(I2C_SDA_PIN, GPIO_LOW)
#define I2C_SDA_READ    GPIO_INPUT_GET(I2C_SDA_PIN)

#define I2C_SCK_IN      GPIO_DIS_OUTPUT(I2C_SCK_PIN)
#define I2C_SCK_HIGH    GPIO_OUTPUT_SET(I2C_SCK_PIN, GPIO_HIGH)
#define I2C_SCK_HIGHSTR I2C_SCK_IN; I2C_DELAY; while (!I2C_SCK_READ) I2C_DELAY;
#define I2C_SCK_LOW     GPIO_OUTPUT_SET(I2C_SCK_PIN, GPIO_LOW)
#define I2C_SCK_READ    GPIO_INPUT_GET(I2C_SCK_PIN)

#define I2C_DELAY       os_delay_us(4); system_soft_wdt_feed();

#define I2C_TIMEOUT     50000

// ...

#endif
```

The initializing method requires setting the desired pins as GPIO's with open-collector.
It is good practice to disable interrupts during this routine (more on interrupts in [Interrupts](/software/task-handling/#interrupts)).

```c
void I2C_init()
{
    // avoid being interrupted
    ETS_GPIO_INTR_DISABLE();

    // use pins as gpio
    PIN_FUNC_SELECT(I2C_SDA_MUX, I2C_SDA_FUNC);
    PIN_FUNC_SELECT(I2C_SCL_MUX, I2C_SCL_FUNC);

    // configure as open collector
    GPIO_REG_WRITE(GPIO_PIN_ADDR(I2C_SDA_PIN),
        GPIO_REG_READ(GPIO_PIN_ADDR(I2C_SDA_PIN)) |
        GPIO_PIN_PAD_DRIVER_SET(GPIO_PAD_DRIVER_ENABLE));
    GPIO_REG_WRITE(GPIO_ENABLE_ADDRESS,
        GPIO_REG_READ(GPIO_ENABLE_ADDRESS) | (1 << I2C_SDA_PIN));
    GPIO_REG_WRITE(GPIO_PIN_ADDR(GPIO_ID_PIN(I2C_SCK_PIN)),
        GPIO_REG_READ(GPIO_PIN_ADDR(GPIO_ID_PIN(I2C_SCK_PIN))) |
        GPIO_PIN_PAD_DRIVER_SET(GPIO_PAD_DRIVER_ENABLE));
    GPIO_REG_WRITE(GPIO_ENABLE_ADDRESS,
        GPIO_REG_READ(GPIO_ENABLE_ADDRESS) | (1 << I2C_SCK_PIN));

    ETS_GPIO_INTR_ENABLE();
}
```

When the GPIO's are configured as needed, the actual I2C driver can be implemented.
As stated in the I2C specification, the I2C start sequence looks as follows:

[I2C Start Sequence][^i2c-spec]

The related implementation can simply be written down using the introduced macros.

```c
uint8 I2C_start(
    uint8 address,
    uint8 readwrite)
{
    // generate start sequence
    I2C_SDA_HIGH;
    I2C_DELAY;
    I2C_SCK_HIGHSTR;
    I2C_DELAY;

    I2C_SDA_LOW;
    I2C_DELAY;

    I2C_SCK_LOW;
    I2C_DELAY;

    // shift address one position to left, take
    // readwrite bit to least significant bit and
    // write this data out to the slave device(s)
    return I2C_write((address << 1) | (readwrite & 1));
}
```


Reference
---------

[^non-os-sdk-api]: [Espressif - ESP8266 Non-OS SDK API Reference](/media/liot_esp8266_env/datasheets/esp8266_non_os_sdk_api_reference.pdf)

[^i2c-spec]: [I2C-Bus Specification and User Manual](http://cache.nxp.com/documents/user_manual/UM10204.pdf)
