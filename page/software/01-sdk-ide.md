---
layout: page
title: SDK + IDE
permalink: /software/sdk-ide/
---

Source Development Kit
----------------------

The esp-easy-sdk is used to build the LIOT_ESP8266_ENV firmware.
This SDK is a fork of the popular esp-open-sdk, but includes additional Makefiles that facilitate the build process for unexperienced users.
The esp-open-sdk in turn allows to build a complete standalone SDK with toolchain based on the NON-OS SDK by Espressif.
So, the esp-open-sdk and thus the esp-easy-sdk contains all tools to build and flash firmwares for ESP8266 chips.
However, it requires a GNU/POSIX system like Linux.

### Setup

The complete setup process is described in the project's readme on GitHub.

* <https://github.com/liotio/esp-easy-sdk>

The build of the toolchain takes about 30 to 60 minutes, depending on your system.

### Minimal Firmware

In order to understand the build process of your software and the memory management mechanism that is described in the next subsection, you should create a minimal firmware.
For this, create the following files in a directory of your choice.

```
app
|--- app.c
|--- user_config.h
+--- Makefile
```

Copy the following code into the `app.c` file.
It contains the `user_init` method that represents the starting point of the firmware.
Additionally, Wi-Fi will simply be turned off.

```c
#include "osapi.h"
#include "user_interface.h"

void user_init()
{
    wifi_set_opmode(NULL_MODE);
}
```

The `user_config.h` file only has to be there, for now there is no content required.

For now, the `Makefile` can be extremely simple.
Only a program name has to be set (which has no actual impact on the firmware itself) and the common build Makefile of the `esp-easy-sdk` has to be included.

```
PROGRAM = app
include $(ESP_EASY_SDK)/common.mk
```

Now, the firmware can be build simply calling:

```bash
make
```

### Memory Management

The ESP8266EX has relatively little memory, but provides a sophisticated mechanism to deal with it.
This section presents in detail the memory management, the mode of operation and their impact.

Like almost all microcontrollers the ESP8266EX uses a memory structure that is based on the Harvard architecture, which means that data and instructions (code) are stored in separated segments.
Because often the entire instructions cannot be held in main memory, they can be stored (uncached) in the much larger but slower external flash memory.
The data segment is abbreviated subsequently only by DRAM, the segment for cached instructions is called IRAM and the uncached instructions segment is named IROM.

The main memory is divided into 64 kB of IRAM for instructions and 96 kB of DRAM.
Whether this memory can be fully used by the user application, is still doubtful.

A sufficiently good overview of the memory structure can be made with the size tool of the GCC cross compiler.
The following listing shows an exemplary output of this tool.
Descriptions of the displayed sections have been added in a comment-like style afterwards.

```
section          size         addr
.data             868   1073643520   // DRAM  - initialized data
.rodata           160   1073644400   // DRAM  - read-only data
.bss            25112   1073644560   // DRAM  - uninitialized data
.text           23936   1074790400   // IRAM - cached code
.irom0.text    188196   1076101120   // IROM - uncached code
.comment         6917            0
.xtensa.info       56            0
Total          245245
```

The stated segments DRAM, IRAM and IROM can also be found in the linker scripts of the SDK as shown in excerpts in the following code listing.
Later in this file, there are also the assignments of the sections from output listing above to the segments from output listing below.

```
MEMORY
{
  dport0_0_seg : org = 0x3FF00000, len = 0x10
  dram0_0_seg :  org = 0x3FFE8000, len = 0x14000
  iram1_0_seg :  org = 0x40100000, len = 0x8000
  irom0_0_seg :  org = 0x40240000, len = 0x3C000
}
```

These declarations indicate that the application can only use 14000<sub>16</sub> = 81920<sub>10</sub> bytes of RAM, 8000<sub>16</sub> = 32768<sub>10</sub> bytes of IRAM and depending on the size of the flash memory and in use with the provided linker scripts from 2B000<sub>16</sub> = 176128<sub>10</sub> to E0000<sub>16</sub> = 917504<sub>10</sub> bytes of IROM.

The values shown are also the minimum values that could be achieved with own tests.
In this case, the application consisted only of the `user_init` function that is used as the `call_user_start` entry symbol and of the necessary (empty) `user_config.h` file.
The libraries that have to be linked at least, are libgcc and the SDK libraries libmain, libnet80211, liblwip, libphy, libpp and libwpa.
The output shows that with 25.5 of 80 kB there are only 32% of the DRAM in use, but with 23.4 of 32 kB already 73% of the IRAM.

What instructions are held in IRAM or IROM can be defined precisely by the user within the above limits.
Methods that cope with a lower execution speed can be denoted with the `ICACHE_FLASH_ATTR` macro that is used for the assignment to the `.irom0.text` section.
If the IRAM is no longer sufficient, the `-DICACHE_FLASH` flag can be added to the compiler flags, by which all denoted user methods are now moved to the IROM segment.
This can also be used to affect variables, but static variables always require additionally memory in RAM.
The same applies to global variables, whereas static declared global variables do not need the additional memory twice.

The call of the `user_init` method in the following code is done on the slower IROM whereas the call of the `sys_init_done_cb` callback method is done on the fast IRAM.

```c
#include "osapi.h"
#include "user_interface.h"

void sys_init_done_cb()
{
    wifi_set_opmode(NULL_MODE);
}

void ICACHE_FLASH_ATTR user_init()
{
    system_init_done_cb(sys_init_done_cb);
}
```

Overall, it becomes clear that the ESP8266EX is suitable only for very small applications, if the instructions must be stored completely in IRAM.
If lower speeds can be taken into account, this Wi-Fi-integrated MCU is a good choice.


Eclipse IDE Setup
-----------------

There are different Integrated Development Environments (IDE's) and editors that can be used for programming and building.
A popular choice is the Eclipse IDE with the C/C++ Developer Tools.
Simply download it from the following page and use the installer to install it.

<http://www.eclipse.org/downloads/packages/eclipse-ide-cc-developers/neon2>


### Create a Makefile Project

![Create a new Makefile project](/media/liot_esp8266_env/software/sdk/ide/makefile_project.png)

![Configure the new Makefile project](/media/liot_esp8266_env/software/sdk/ide/makefile_project_config.png)

![Create a new Makefile](/media/liot_esp8266_env/software/sdk/ide/makefile_new.png)

![Edit the new Makefile](/media/liot_esp8266_env/software/sdk/ide/makefile_content.png)

Same way create new directory `include`, the file `user_config.h` in the just created `include` directory and the file `app.c` in the project root directory.


### Add Project's Include Paths

![Edit the new Makefile](/media/liot_esp8266_env/software/sdk/ide/path_sdk_include.png)

Same way add directory path `/app/include/`, but this time also select the option "Is a workspace path".


### Write a simple Program

Now fill `app.c` with code again as above. The file `user_config.h` again must only exist, but can be empty.

```c
#include "osapi.h"
#include "user_interface.h"

void user_init()
{
    wifi_set_opmode(NULL_MODE);
}
```

Furthermore, again fill the Makefile with the code shown in the following image.

![Edit the new Makefile](/media/liot_esp8266_env/software/sdk/ide/app_code.png)

### Create Make Targets

![Create a new Make target](/media/liot_esp8266_env/software/sdk/ide/make_target.png)

Now compilation can be started by double clicking "all" Makefile target execute it from the shell.

```bash
make all
```

![Edit the new Makefile](/media/liot_esp8266_env/software/sdk/ide/app_compile.png)

Also add other Makefile targets. The whole list of build targets is:

* `all` Default target. Will build firmware including any changed source files.

* `clean` Delete all build output.

* `rebuild` Build everything fresh from scratch.

* `flash` Build then upload firmware to MCU. Set ESPPORT & ESPBAUD to override port/baud rate.

* `test` Execute flash, then start a GNU Screen session on the same serial port to see serial output.

* `size` Build, then print a summary of built firmware size.

* `help` Prints this list

