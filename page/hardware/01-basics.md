---
layout: page
title: Hardware Basics
permalink: /hardware/basics/
---

You may know electrical basics from your school or university.
Still there are some conventions that need to be learned.
Moreover, it could be time to refresh your knowledge.

Electrotechnical Basics
-----------------------

### Voltage
 
Electrical voltage is the difference in electrical potential energy between two points in a circuit.
If a difference of this electrical potential energy is given, this means that one point has more charge than the other.
Then, these two points are called the poles, of which one is the positive (more charge) and the other the negative (less charge) pole.
Voltage is measured in volts $$(\text{V})$$, the formula symbol is $$U$$ or $$V$$, but we will use $$U$$ for unambiguity.
[^voltage]

### Current

Electrical current is the flow of such electric charge.
In electrical conductors and semiconductors, the charge carriers are electrons.
Current flows when an electrical voltage is present between two conductive connected points.
Current is distinguished into direct current (DC) and alternating current (AC).
Alternating current is primarily needed to transport electrical charge over large distances.
However, almost only direct current is used in the context of portable small electronics.
Current is measured in amperes $$(\text{A})$$, the formula symbol is $$I$$.
[^current]

Precise, current is defined as the quantity of electrical charge carriers $$(Q)$$ during a time period $$(t)$$.

$$
I = \frac{Q}{t}
$$

During current flow, the conductor heats up and a magnetic field is created.

Remembering the direction of current flow can be confusing.
The reason for this is the flow direction of electrical charge carriers (negatively charged) to the positive pole.
In circuit diagrams, however, only the actual electrical current flow is of interest that goes from the positive to the negative pole.

### Power

Electrical power is the electrical energy that is transformed during a time period.
It can either be drawn ("consumed") or supplied ("generated").
Power is measured in watts $$(\text{W})$$, the formula symbol is $$P$$.
[^power]

Power can be specified as the product of voltage and current:

$$
P = U \cdot I
$$

Different voltage levels are needed e.g. because the amount of current is limited on different carrier types like wires.
In order to reach the same power, the current can be reduced when the voltage is raised.

### Resistance

Electrical resistance of an electrical conductor is a measure of how difficult it is to pass an electric current - or more precise which electric voltage is required to allow a certain electric current to flow through that conductor.
It is called ohmic resistance if the value of resistance is independent of the voltage and the current.
Ohmic resistance is measured in ohms $$(\Omega)$$, the formula symbol is $$R$$.
[^resistance]

The resistance of a conductor can be calculated with the specific electrical resistance $$(\rho)$$ of the material depending on the temperature, the cross sectional area $$(A)$$ and the length $$(l)$$.

$$
R = \rho \cdot \frac{l}{A}
$$

### Ohm's law

Ohm's law states that voltage, current, and resistance are related as follows.
[^ohmslaw]

$$
U = R \cdot I
$$

Since the formula can also easily be changed to an equation for $$R$$ and $$I$$, it can be applied in many ways.
Strictly speaking, this formula is only true on a small scale and for a few substances, however it can be used for a basic understanding of the correlation of voltage, current and resistance.

### Capacitance

Electrical capacitance is the ability of a body to store an electrical charge.
It is not to be confused with electric charge of which is spoken in the case of (rechargeable) batteries.
Capacitance is measured in farad $$(\text{F})$$, the formula symbol is $$C$$.
[^capacitance]

The electrical capacitance between two electrically conductive bodies is equal to the quotient of the charge quantity $$(Q)$$ stored on these conductors, and the electrical voltage between them $$(U)$$:

$$
C = \frac{Q}{U}
$$

### Magnetism

TBD

### Impedance

TBD


Circuits and Schematics
-----------------------

Today mainly digital.

Example blinking LED in analog schematic https://i.stack.imgur.com/XZ8Or.jpg

With digital IC + resistor.

Importance of some components changed.
Resistor mainly used for current limitation and logic level definition.

How to read...
[^network]

Electrical Components
---------------------

Electrical components can be distinguished according to different characteristics.
Thus, for example, it can also be distinguished between ideal and real components or analog and digital components.
Most commonly, however, a distinction is made between active and passive components.

Passive components are characterized by the fact that they have no amplifier effect and do not have a control function.
Active components, on the other hand, can provide a signal with more power compared to the received signal, or allow control.
For this purpose, they draw auxiliary energy from an additional power supply or generate electrical energy themselves.
[^component]

The following list provides an overview of typical and important components in the context of embedded systems and the Internet of Things.

### Power Sources

Power sources are active components as they provide energy to a circuit.
For mobile devices, many different types of (rechargeable) batteries that provide direct current (DC) are the state of the art.
Stationary devices, on the other hand, can be powered by a power supply that that converts alternating current (AC) from the electrical grid to direct current (DC).
Depending on the application area and the environment, however, other power sources such as solar cells are also conceivable.

![Power Source Symbol](/media/hardware/basics/powersource-symbol.png)
*Symbol of a DC power supply and a 1-cell battery*

In digital schematics mainly distinction between power source, often named VCC (positive pole) and ground, often named GND (negative pole).

### Resistors
 
(passive)

Wires just like resistors, ...

![Resistor Symbol](/media/hardware/basics/resistor-symbol.png)
*EU and US symbol of a resistor*

### Capacitors

Capacitors are passive components and allow to make use of capacitance.

![Capacitor Symbol](/media/hardware/basics/capacitor-symbol.png)
*EU and US symbol of a capacitor*

...

### Inductors

passive

![Inductor Symbol](/media/hardware/basics/inductor-symbol.png)
*EU and US symbol of a inductor*

### Transistors

active

### Diodes

active

Diode
Schottky Diode
Light-emitting diode (LED)
Photodiode

As an illustrative example is a diode that transmits current in only one direction.
See http://cdn2.rare-earth-magnets.com/images/content/conventional-versus-electron-flow-4.jpg

### Integrated Circuits (active)

Regulators
Logic Gates
Sensors

### Displays (active)

E-Ink for mobile devices.
LED and LCD displays for stationary devices.

### Other Components

* motors
* generators
* switches
* relays
* transformers


References
----------

[^voltage]: <https://en.wikipedia.org/wiki/Voltage>

[^current]: <https://en.wikipedia.org/wiki/Electric_current>

[^power]: <https://en.wikipedia.org/wiki/Electric_power>

[^resistance]: <https://en.wikipedia.org/wiki/Electrical_resistance_and_conductance>

[^ohmslaw]: <https://en.wikipedia.org/wiki/Ohm's_law>

[^capacitance]: <https://en.wikipedia.org/wiki/Capacitance>

[^network]: <https://en.wikipedia.org/wiki/Electrical_network>

[^component]: <https://en.wikipedia.org/wiki/Electronic_component>

[^]: <>

<!---

https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law

https://learn.sparkfun.com/tutorials/what-is-electricity

https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law

https://www.mikrocontroller.net/articles/Ausgangsstufen_Logik-ICs

http://rn-wissen.de/wiki/index.php/Abblockkondensator#Welchen_Kondensatortyp_verwenden.3F

--->