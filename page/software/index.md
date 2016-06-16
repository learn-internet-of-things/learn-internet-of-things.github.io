---
layout: default
title: Software
permalink: /software/
---

Hallo Welt

{% highlight c %}
/**
 * @file   es2812_rainbow.c
 * @author Ondřej Hruška, 2016
 *
 * @brief  Example of a rainbow effect with
 *         WS2812 connected to GPIO2.
 *
 * This demo is in the public domain.
 */

#include "FreeRTOS.h"
#include "task.h"
#include "esp/uart.h" // uart_set_baud
#include <stdio.h> // printf
#include <stdint.h>

#include "portmacro.h"
#include "c_types.h"

#include "lwip/api.h"

#include "espressif/esp_common.h"

#include "semphr.h"

#include "ws2812.h"

#include "station_config.h"

#include "system.h"

#define delay_ms(ms) vTaskDelay((ms) / portTICK_RATE_MS)


/** GPIO number used to control the RGBs */
const uint8_t pin = 5;
const int gpio = 2;

xSemaphoreHandle wifi_alive;

void blinkenTask(void *pvParameters)
{
    gpio_enable(gpio, GPIO_OUTPUT);
    while(1) {
        gpio_write(gpio, 1);
        vTaskDelay(1000 / portTICK_RATE_MS);
        gpio_write(gpio, 0);
        vTaskDelay(1000 / portTICK_RATE_MS);
    }
}

/**
 * @brief "rainbow" animation with a single RGB led.
 */
void demo_single(void *pvParameters)
{
    // duration between color changes
    const uint8_t delay = 25;

    ws2812_rgb_t x = {.num = 0xFF0000}; // RED color

    while (1) {
        // iterate through the spectrum

        // note: This would be _WAY_ easier with HSL

        while(x.g < 0xFF) { x.g++; ws2812_set(pin, x.num); delay_ms(delay); } // R->RG
        while(x.r > 0x00) { x.r--; ws2812_set(pin, x.num); delay_ms(delay); } // RG->G
        while(x.b < 0xFF) { x.b++; ws2812_set(pin, x.num); delay_ms(delay); } // G->GB
        while(x.g > 0x00) { x.g--; ws2812_set(pin, x.num); delay_ms(delay); } // GB->B
        while(x.r < 0xFF) { x.r++; ws2812_set(pin, x.num); delay_ms(delay); } // B->BR
        while(x.b > 0x00) { x.b--; ws2812_set(pin, x.num); delay_ms(delay); } // BR->R
    }
}


/**
 * @brief "rainbow" effect on a RGB strip (30 pixels - can be adjusted)
 *
 * This example shows how to use the "procedural generation" of colors.
 *
 * The pixel colors are calculated on the fly, which saves RAM
 * (especially with large displays).
 */
void demo_strip(void *pvParameters)
{
    const uint8_t anim_step = 10;
    const uint8_t anim_max = 250;

    // Number of your "pixels"
    const uint8_t pixel_count = 30;

    // duration between color changes
    const uint8_t delay = 25;

    ws2812_rgb_t color = WS2812_RGB(anim_max, 0, 0);
    uint8_t step = 0;

    ws2812_rgb_t color2 = WS2812_RGB(anim_max, 0, 0);
    uint8_t step2 = 0;

    while (1) {

        color = color2;
        step = step2;

        // Start a data sequence (disables interrupts)
        ws2812_seq_start();

        for (uint8_t i = 0; i < pixel_count; i++) {

            // send a color
            ws2812_seq_rgb(pin, color.num);

            // now we have a few hundred nanoseconds
            // to calculate the next color

            if (i == 1) {
                color2 = color;
                step2 = step;
            }

            switch (step) {
                case 0: color.g += anim_step; if (color.g >= anim_max) step++;  break;
                case 1: color.r -= anim_step; if (color.r == 0) step++; break;
                case 2: color.b += anim_step; if (color.b >= anim_max) step++; break;
                case 3: color.g -= anim_step; if (color.g == 0) step++; break;
                case 4: color.r += anim_step; if (color.r >= anim_max) step++; break;
                case 5: color.b -= anim_step; if (color.b == 0) step = 0; break;
            }
        }

        // End the data sequence, display colors (interrupts are restored)
        ws2812_seq_end();

        // wait a bit
        delay_ms(delay);
    }
}

static void  wifi_task(void *pvParameters)
{
    uint8_t status  = 0;
    uint8_t retries = 30;
    struct sdk_station_config config = {
        .ssid = WIFI_SSID,
        .password = WIFI_PASS,
    };

    printf("WiFi: connecting to WiFi\n\r");
    sdk_wifi_set_opmode(STATION_MODE);
    sdk_wifi_station_set_config(&config);

    while(1)
    {
        while ((status != STATION_GOT_IP) && (retries)){
            status = sdk_wifi_station_get_connect_status();
            printf("%s: status = %d\n\r", __func__, status );
            if( status == STATION_WRONG_PASSWORD ){
                printf("WiFi: wrong password\n\r");
                break;
            } else if( status == STATION_NO_AP_FOUND ) {
                printf("WiFi: AP not found\n\r");
                break;
            } else if( status == STATION_CONNECT_FAIL ) {
                printf("WiFi: connection failed\r\n");
                break;
            }
            vTaskDelay( 1000 / portTICK_RATE_MS );
            --retries;
        }
        if (status == STATION_GOT_IP) {
            printf("WiFi: Connected\n\r");
            xSemaphoreGive( wifi_alive );
            taskYIELD();
        }

        while ((status = sdk_wifi_station_get_connect_status()) == STATION_GOT_IP) {
            xSemaphoreGive( wifi_alive );
            taskYIELD();
        }
        printf("WiFi: disconnected\n\r");
        sdk_wifi_station_disconnect();
        vTaskDelay( 1000 / portTICK_RATE_MS );
    }
}

void taskLoop(void *pvParameters) {
    uint32_t rtc;
    uint32_t count = 0;

    while(1) {
        count++;
        rtc = sdk_system_get_rtc_time();

        printf("  Count: %d\r\n  RTC: %d\r\n\r\n", count, rtc);

        if (count == 15) {
            // https://github.com/SuperHouse/esp-open-rtos/issues/78
            // sdk_system_deep_sleep(5000000);
            // void (*deep_sleep)(uint32_t time) = (void (*)(uint32_t time))0x40220000+0x734;
            // deep_sleep(5000000);

            _deep_sleep_phase2(5000000);
        }

        vTaskDelay(1000 / portTICK_RATE_MS);
    }
}

void user_init(void)
{
    uint32_t rtc_t, cal;

    uart_set_baud(0, 115200);

    // Configure the GPIO
    gpio_enable(pin, GPIO_OUTPUT);

    printf("SDK version:%s\n", sdk_system_get_sdk_version());

    rtc_t = sdk_system_get_rtc_time();
    cal = sdk_system_rtc_clock_cali_proc();

    printf("\r\n");
    printf("rtc: %d \r\n", rtc_t );
    printf("cal: %d.%d \r\n", ((cal*1000)>>12)/1000, ((cal*1000)>>12)%1000 );


    /*
     * SLEEP MODE
     *
     * include/espressif/esp_system.h
     * FreeRTOS/Source/include/task.h
     * core/include/esp/gpio.h
     *
     * "GPIO16" is a special GPIO pin connected to the RTC subsystem,
     * GPIO16 must be connected to reset to allow wake from deep sleep.
     */


    // Select a demo function:

    // Choose how to run it:

    /*
    // Blocking function - works OK, because WiFi isn't
    // initialized yet & we're hogging the CPU.

    printf("Starting a blocking function.\r\n");
    demo(NULL);
    */

    // Start a task. This is a real-life example,
    // notice the glitches due to NMI.

    printf("Starting a task. There may be glitches!\r\n");

    vSemaphoreCreateBinary(wifi_alive);
    xTaskCreate(wifi_task, (signed char *)"wifi_task",  256, NULL, 2, NULL);

    xTaskCreate(taskLoop, (signed char *)"taskLoop", 200, NULL, 3, NULL);

    //xTaskCreate(demo_single, (signed char *)"demo_single", 256, NULL, 2, NULL);
    //xTaskCreate(blinkenTask, (signed char *)"blinkenTask", 256, NULL, 2, NULL);
}

{% endhighlight %}