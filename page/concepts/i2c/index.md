---
layout: default
title: I²C
---

Inter-Integrated Circuit (I²C)
==============================

Developed by Philips, ...

I²C devices have addresses.
One I²C connection can be connected to X devices at the same time.
In earlier days, addresses of chips were programmable.
Today often only two addresses to pick from by pulling up or pushing down a GPIO.
There are also chips, even expensive ones, that are are not addressable at all.
Then, the connection can only be used by one single slave device.

In the official ESP8266EX datasheet it is said[^datasheet]:

> I2C Interface
> -------------
>
> ESP8266EX has one I2C used to connect with micro-controller and other peripheral equipments such as sensors.
> The pin definition of I2C is as below.
>
> Table 4-5: Pin Definitions of I2C
>
> | Pin Name | Pin Num | IO    | Function Name |
> |:--------:|:-------:|:-----:|:-------------:|
> | MTMS     | 9       | IO14  | I2C_SCL       |
> | GPIO2    | 14      | IO2   | I2C_SDA       |
>
> Both I2C Master and I2C Slave are supported.
> I2C interface functionality can be realized via software programming, the clock frequency reaches 100 KHz at a maximum.
> It should be noted that I2C clock frequency should be higher than the slowest clock frequency of the slave device.

But this implicitely means, that you can use any GPIO for software-based I²C.
This is sad on the one hand as any I²C communication has to be done by the processor, but on the other hand there is no need to use IO14 for the SCL since this pin is needed by HSPI.

```
      1   2   3-9
SDA  /‾\_/‾\_/‾‾‾\_/‾\...

SCK  /‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_
```


```c
/*
 * Test
 *

void user_init() {
    
}
```

References
----------

[^datasheet]: [ESP8266EX Datasheet](http://espressif.com/en/file/957/download?token=qg825sq2)