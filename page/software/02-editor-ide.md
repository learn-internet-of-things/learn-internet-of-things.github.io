---
layout: page
title: Editor / IDE
permalink: /software/editor-ide/
---

...

Eclipse Download & Installation
-------------------------------

Create a Makefile Project
-------------------------

![Create a new Makefile project](/media/software/sdk/ide/makefile_project.png)

![Configure the new Makefile project](/media/software/sdk/ide/makefile_project_config.png)

![Create a new Makefile](/media/software/sdk/ide/makefile_new.png)

![Edit the new Makefile](/media/software/sdk/ide/makefile_content.png)

Same way create new directory `include`, the file `user_config.h` in the just created `include` directory and the file `app.c` in the project root directory.

Add Project's Include Paths
---------------------------

![Edit the new Makefile](/media/software/sdk/ide/path_sdk_include.png)

Same way add directory path `/app/include/`, but this time also select the option "Is a workspace path".


Write a simple Program
----------------------

Now fill `app.c` with code. The file `user_config.h` must only exist, but can be empty.

```c
#include "osapi.h"
#include "user_interface.h"

void user_init()
{
    wifi_set_opmode(NULL_MODE);
}
```

![Edit the new Makefile](/media/software/sdk/ide/app_code.png)

Create Make Targets
-------------------

![Create a new Make target](/media/software/sdk/ide/make_target.png)

Now compilation can be started by double clicking "all" Makefile target execute it from the shell.

```bash
make all
```

![Edit the new Makefile](/media/software/sdk/ide/app_compile.png)

Also add other Makefile targets. The whole list of build targets is:

* `all` Default target. Will build firmware including any changed source files.

* `clean` Delete all build output.

* `rebuild` Build everything fresh from scratch.

* `flash` Build then upload firmware to MCU. Set ESPPORT & ESPBAUD to override port/baud rate.

* `test` Execute flash, then start a GNU Screen session on the same serial port to see serial output.

* `size` Build, then print a summary of built firmware size.

* `help` Prints this list
