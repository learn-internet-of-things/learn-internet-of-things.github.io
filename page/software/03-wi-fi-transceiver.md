---
layout: page
title: Wi-Fi Transceiver
permalink: /software/wi-fi-transceiver/
---

Different operation modes.
Foundation for TCP/IP.
Server role with HTTP server, client role with MQTT client.

Operation Modes
---------------



```c
void WIFI_SOFTAP_init_user()
{
    char buffer[64];
    struct softap_config config;
    wifi_softap_get_config(&config);

    os_memset(config.ssid, 0, 32);
    os_memset(config.password, 0, 64);
    os_sprintf(buffer, "%s_%u", AP_SSID, system_get_chip_id() % 10);
    os_memcpy(config.ssid, buffer, os_strlen(buffer));
    os_memcpy(config.password, AP_PASS, os_strlen(AP_PASS));
    config.authmode = AUTH_WPA2_PSK;
    config.ssid_len = 0;
    config.max_connection = 4;

    wifi_softap_set_config(&config);
}
```

```c
void WIFI_connect(
        wifi_callback_t callback)
{
    struct station_config station_conf;
    os_memset(&station_conf, 0, sizeof(struct station_config));
    WIFI_callback = callback;

    // write SSID / PASS to station config
    os_sprintf(station_conf.ssid, "%s", STA_SSID);
    os_sprintf(station_conf.password, "%s", STA_PASS);
    wifi_station_set_config(&station_conf);

    // set a timer to check whether got ip from router succeed or not.
    os_timer_disarm(&WIFI_timer);
    os_timer_setfn(&WIFI_timer, (os_timer_func_t *) WIFI_check_ip, NULL);
    os_timer_arm(&WIFI_timer, 100, 0);

    wifi_station_connect();
}
```

HTTP Server
-----------

```c
void HTTPD_init()
{
    httpdConn.type = ESPCONN_TCP;
    httpdConn.state = ESPCONN_NONE;
    httpdTcp.local_port = 80;
    httpdConn.proto.tcp = &httpdTcp;

    espconn_regist_connectcb(&httpdConn, HTTPD_on_connection);
    espconn_accept(&httpdConn);
}

void HTTPD_on_connection(
        void *arg)
{
    struct espconn *conn = arg;
    // only set recv callback, skip others
    espconn_regist_recvcb(conn, HTTPD_on_receive);
    espconn_set_opt(conn, ESPCONN_NODELAY);
}

void HTTPD_on_receive(
        void *arg,
        char *data,
        unsigned short len)
{
    struct espconn *conn = arg;

    char method[5];
    char location[256];
    char buffer[256];

    http_request_method(data, method, 5);
    http_request_location(data, location, 256);

    if (strcmp(method,"GET") == 0) {

        if (strcmp(location,"/") == 0) {

            sint32 temp = BME280_temp_sint;
            sint32 temp_pre = temp / 100;
            if (temp < 0) temp *= -1;
            sint32 temp_post = temp % 100;

            uint32 hum = BME280_hum_uint;
            uint32 hum_pre = hum / 1024;
            uint32 hum_post = hum % 1024;

            uint32 press = BME280_press_uint / 256;
            uint32 press_pre = press / 100;
            uint32 press_post = press % 100;

            os_sprintf(buffer, "\nTEMP: %d.%u degC\nHUM: %u.%u pctRH\nPRESS: %u.%u hPa", temp_pre, temp_post, hum_pre, hum_post, press_pre, press_post);

            espconn_sent(conn, buffer, os_strlen(buffer));
        }
    }

    espconn_disconnect(conn);
}
```


MQTT Client
-----------


References
----------