---
layout: page
title: Hardware Layout
permalink: /hardware/layout/
---

The exact technical implementation depends on the applied CAD software.
On this page, the “Cadsoft EAGLE PCB Design Software” was used but this plays a subordinate role in the final outcome.

Sparkfun offers a good tutorial for a first simple board layout.
See https://learn.sparkfun.com/tutorials/using-eagle-board-layout

* [Sparkfun - PCB Basics](https://learn.sparkfun.com/tutorials/pcb-basics)

* [Sparkfun - Designing PCBs: SMD Footprints](https://learn.sparkfun.com/tutorials/designing-pcbs-smd-footprints)

* [Sparkfun - Designing PCBs: Advanced SMD](https://learn.sparkfun.com/tutorials/designing-pcbs-advanced-smd)

In the first step a package must be created for each symbol of the circuit diagram.
It must be selected between the through-hole or surface-mounting technology, if applicable. 
Then, the package is placed on the board layout, before the vias are defined, and the routes between the components are drawn either manually or automatically,
according to the circuit diagram. As the antennas are placed directly on the PCB, and a fairly high heat development can be expected, some important aspects must be considered.
A fundamental question, when creating a PCB, affects the number of layers.
Usually, the number is staggered in pairs, which means that it can be chosen between two, four, six, etc. layers.
However, the price of the PCB particularly increases when using four instead of two layers.
In principle, it is possible to implement the proposed board with only two layers, but this makes a sufficient heat dissipation of the components very difficult, and it can also lead to stronger interference between the lines.
Therefore, it is a better approach to use four layers.

The upper and lower layers are then essentially signal layers, and the intermediate ones are for ground and power supply, respectively.
The greatest possible number of vias to the ground plane results in the fact, that the heat is well dissipated away from the components.
As mentioned before, antennas can be placed directly on the PCB, such as the antennas for Wi-Fi and the 868 MHz transceiver. The 2.4 GHz antenna for Wi-Fi is a pure PCB antenna, according to reference design from Texas Instruments.
However, the 868 MHz antenna is a combined solution of a ceramic and PCB antenna, modeled on a reference design from Johanson Technology.
Both antennas have in common that they need a so-called keepout zone which means that no other layers must be contained in their area.
Furthermore, they require a feed line with an impedance of 50 Ω.
To achieve the impedance of 50 Ω, it is advisable to use a coplanar waveguide.
For this board, the coplanar waveguide included into the AppCAD software by Avago Technologies has been used, but they are also available numerously in the web.
The usual parameters of the PCB such as the thickness of the upper signal layer, the distance from the ground plane, the length of the feed line, the material used and the intended frequency can be entered.
The appropriate values for the width of the feed line and the distance to the rest of the plane has to be tested by trial and error, until the desired impedance of 50 Ω is nearly reached.
The used and calculated parameters for the Wi-Fi antenna of this board can be seen on a screenshot of the user interface of AppCAD in figure 15.

This process has to be repeated for all antennas on the board - in this case for the 868 MHz antenna.
But whereas for the first antenna the thickness of the signal layers could be adjusted, for the following antennas of course only the width of the feed line may be changed, in order to preserve the impedance of the preceding antennas.
The remaining realization of the board is standard procedure to the greatest extent, and most notably very dependent on the used CAD software, so that it is not further presented in this thesis.
The board layout is shown in figure XY.
However, the following aspects were also considered: On the back of the board, the case for a rechargeable battery with AA size can be mounted.
Pin headers can be soldered to the pad holes allowing the attachment of the board upside down on a breadboard, because of its narrow form.
Furthermore, other components can be connected to lead-out lines of the I/O expander and the I2C bus.
When using the lead-out SPI lines the signal can be examined by the help of an oscillograph.

After the PCB has been assembled, the final board will look like as illustrated by the 3D model in figure 16 (without battery case on the back).

If no errors have been made, next, the implementation of the software can be started.

![LIOT_ESP8266_ENV Board Documentation](/media/liot_esp8266_env/liot_esp8266_env-board-docu.png){:width="40%"}
*LIOT_ESP8266_ENV Board Documentation*