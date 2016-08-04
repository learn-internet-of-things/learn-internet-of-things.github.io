---
layout: page
alias: Design
title: Design
permalink: /hardware/design/
---

Designing the Hardware
======================

The hardware will be designed with [Eagle](http://www.cadsoft.de/download-eagle/eagle-freeware/).
Other options exist.

The software launches with its *Control Panel*.
Create a new *Project* by clicking *File*, *New* and *Project*.
By rightclicking the just created project, you can now create a new *Schematic* for your project.
This opens the Eagle editor.

The left panel contains the *Command Menu*, the top panel contains all *Actions* and *Parameters*.
The command menu also includes all tools.
All these *Commands* can also be executed by just typing their names in and confirming then by pressing the *Enter* key.
 
In an empty schematic, the only *Parameter* that can be changed, is the *Grid*.
We will change the grid often later, but it is `usually not necessary to change the grid in the schematics view.
One of the only actions that are interesting at the beginning, is the *Create board / Change to board* button.
Once you did this, the boards and schematics files will be kept synchronized.

In a schematic, basically *Devices* are connected by different types of wires.
Each device consists of a *Symbol* for the schematic and a *Package* that defines the dimensions and the connections of a device.
Devices are grouped into libraries that can also be downloaded at various places in the internet.
There are some basic devices like resistors, transistors, etc. that are provided by the default Eagle libraries.
When designing your custom PCB, you will also need devices that are not included in these default libraries.
Instead of downloading libraries that include your device of choise from other people, you should create and maintain your own libraries.
Learning how to create custom devices may take only about half an hour.
Then, you are able to grab the datasheets of your devices and create them yourself.
That's the only way to be sure not to copy the mistakes of others.

Before starting with adding devices to your schematic, let's create an own device - the ESP8266EX.

Switch to the control panel window and select *File*, *New* and *Library*.