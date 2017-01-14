---
layout: page
title: Power Modes
permalink: /software/power-modes/
---

There are different ways to reduce the power consumption of the board without affecting the actual benefit of the board.
These include low-power modes for the Wi-Fi transceiver, the whole microcontroller, the peripherals or even turning off the complete power supply of the board.
But before, a solution should be implemented to monitor the battery.

Battery Monitoring
------------------

The charge of the battery can be determined with different methods.
The most precise would be to monitor the amount of charge or discharge and set it in relation to the actual battery capacity.
An easier way is to measure the battery voltage and set in relation to the minimum and maximum battery voltage.
Certainly, this method is imprecise if much current is taken from the battery and because the the voltage drop of the battery is not linear to the charge drop.
However, this method will be used for the `LIOT_ESP8266_ENV`.

In the hardware section, precautions have already been taken for this kind of battery monitoring.
As we need to bring a voltage of maximum 1.0 V to the input of the analog-to-digital converter (ADC), a voltage divider has been implemented.
This voltage divider reduces the battery voltage of 4.3 V to a ADC input voltage of 0.88 V.
In order to reduce the power loss if no ADC input is needed, it is possible to turn the voltage divider off using the I/O port expander with port `P0.7`.

[Link to Hardware Section]

A Li-Ion battery ...
[^li-ion]

![Battery Characteristics](/media/liot_esp8266_env/software/power-modes/battery-characteristics.png)
*Rechargeable battery charge/discharge curve with mid-point voltage (MPV) and end-of-discharge voltage (EODC) [^recharge-batteries]*

The measurement unit of the ADC is 1/1024 V, which means that an input value of 1024 represents 1.0 V.
The SDK offers two methods two read the ADC input of which we use the more simple, but less fast and precise `system_adc_read()` method, that directly returns the input value.
[^non-os-sdk-api]

| U<sub>BAT</sub> | U<sub>ADC</sub> | ADC |
| --------------- | --------------- | --- |
| 4.3 V           | 0.88 V          | 901 |
| 4.2 V           | 0.86 V          | 880 |
| 4.1 V           | 0.84 V          | 860 |
| 4.0 V           | 0.82 V          | 839 |
| ...             | ...             | ... |
| 3.7 V           | 0.76 V          | 778 |
| 3.6 V           | 0.73 V          | 747 |

To convert the ADC input value to the voltage value, it has to be divided by 1024 as stated above.
Since the voltage drop is not linear related to the charge drop and dependent to other factors like the temperature - especially at complete charge or discharge - we allow some tolerances in these areas.
A voltage above 0.87 V will be considered as 100% charge and a voltage below 0.74 V will be considered as 0% charge of the battery.
For all values in between, the minimum voltage of the battery (0.74 V) has to be subtracted.
Then this new value has to be divided by the difference of the maximum and the minimum voltage of the battery in order to get the percentage value of the battery.

$$
P_{BAT} = \frac{U_{ADC} - U_{MIN}}{U_{DIFF}} 
$$

For example, the battery might have a voltage of 4.0 V.
Then the voltage divider provides a ADC input voltage (U<sub>ADC</sub>) of 0.82 V.
The minimum voltage (U<sub>MIN</sub>) is 0.74 V as stated above.
The difference of the maximum and minimum voltage (U<sub>DIFF</sub>) is 0.13 V.
Thus, the battery percentage is calculated as follows:

$$
P_{BAT} = \frac{0.82 - 0.74}{0.13} = \frac{0.08}{0.13} = 0.62 = 62 \%
$$

In the implementation in software, first the voltage divider is activated by setting the I/O port expander port `P0.7` to 1.
Then, the voltage is read with the ADC and the percentage value is calculated.
After deactivating the voltage divider again, the actual result is published via MQTT.

```c
uint16 adc;
float adc_volt;
uint8 bat_pct;
char topic[32];
char payload[96];

os_delay_us(500);
TCA6416A_set_outputs(TCA6416A_P0_7, 1);
os_delay_us(500);

adc = system_adc_read();
os_printf("\nADC: %u", adc);

adc_volt = adc / 1024.0;

if (adc_volt > 0.87) {
    bat_pct = 100;
} else if (adc_volt <  0.74) {
    bat_pct = 0;
} else {
    bat_pct = ((adc_volt - 0.74) / 0.13) * 100;
}

os_delay_us(500);
TCA6416A_set_outputs(TCA6416A_P0_7, 0);
os_delay_us(500);

os_sprintf(topic, "liot_esp8266_env/%u/battery", DEVICE_ID);
os_sprintf(payload, "{ \"battery\": %u, \"adc\": %u }", bat_pct, adc);

MQTT_publish(topic, payload, strlen(payload), 0, 0);
```

Without any low-power modes about 7 hours runtime with a 700 mAh battery.


References
----------

[^li-ion]: [Wikipedia - Lithium-Ion Battery](https://en.wikipedia.org/wiki/Lithium-ion_battery)

[^recharge-batteries]: [Texas Instruments - Characteristics of Rechargeable Batteries](http://www.ti.com/lit/an/snva533/snva533.pdf)

[^non-os-sdk-api]: [Espressif - ESP8266 Non-OS SDK API Reference](/media/liot_esp8266_env/documents/esp8266_non_os_sdk_api_reference.pdf)