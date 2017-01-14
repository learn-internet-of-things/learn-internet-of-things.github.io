---
layout: page
title: Task-Handling
permalink: /software/tasks-timers-interrupts/
---

To accomplish an interaction of the components, a task, a timer and interrupts are used.
The timer is needed to execute the task that is explained subsequently in a predened time interval.
One of the missions of the task, for example, is reading the actual measurement values from the sensors.
So, other parts of the application can use these continuously updated values without directly accessing the I2C slaves.
The interrupts are used just as the timer with the dierence, that their occurrence is based on certain events, instead of a time interval.

Tasks
-----


Timers
------


Interrupts
----------


References
----------