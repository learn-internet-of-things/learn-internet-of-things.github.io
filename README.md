README
======

Jekyll
------

### Windows

Ruby 2.2.5 (x64)

http://rubyinstaller.org/downloads/

Install it for example to `C:\Tools\Ruby22-x64`
Select checkbox "Add Ruby executables to your PATH"

DevKit "for use with Ruby 2.0 and above (x64 - 64bits only)"

http://rubyinstaller.org/downloads/

`C:\Tools\DevKit2`
Add `C:\Tools\DevKit2\bin` to PATH

CMD to `C:\Tools\DevKit2`

```
ruby dk.rb init
ruby dk.rb install
```

Open CMD window.

```
gem install bundler
```

Change in CMD to Github pages reposity

```
bundle install
```

Then, the `server.bat` can be used to start the server.


Notes
-----

Markdown

http://kramdown.gettalong.org/quickref.html#footnotes