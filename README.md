
# homebridge-xiaomi-air-purifier3
Homebridge plugin for controlling Xiaomi Air Purifier 3/3H

# Features
* Turning device On/Off
* Change mode to _Manual_ or _Automatic_
* Fine tune the _Fan Speed_ using 100 step increments
* Display the current Fan Speed even in Automatic mode
* Toggle _Child Lock_ switch to enable/disable manual controls on the device
* Expose _Air Quality_ sensor with current PM2.5 value
* Configurable PM2.5 AQI Breakpoints
* Expose *Filter Life Level* and *Filter Change Indication* to HomeKit
* Display device as *Idle* when the fan speed is the lowest possible
* Automatically show updates in HomeKit when the device is controlled from outside HomeKit

# Installation
1. Install *homebridge*:
	```
	npm install -g homebridge
	```
2. Install *homebridge-xiaomi-air-purifier3*: 
	```
	npm install -g homebridge-xiaomi-air-purifier3
	```

# Configuration

```
"accessories": [
        {
            "accessory": "XiaomiAirPurifier3",
            "name": "Xiaomi Air Purifier",
            "did": "XXXXXXXXX",
            "ip": "10.0.X.X",
            "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "pm25_breakpoints": [5, 12, 35, 55]
        }
]
```

## Fields:
* **accessory**: Must always be "XiaomiAirPurifier3" (required)
* **name**: Name that will be displayed in your home app (required)
* **did**: The device id of the air purifier (required)
* **ip**: Ip address of the air purifier (required)
* **token**: The device token of the air purifier (required)
* **pm25_breakpoints**: PM2.5 aqi breakpoints for air quality levels (optional)

## Device id (did) and IP Address (ip)

*IMPORTANT*: I recommend that you assign a static ip address in order to avoid having your router change the ip address of the device on reboot or when the lease expires.

1. Is install the miio npm package
    ```
    npm install -g miio
    ```
2. Make sure your computer is on the same network with your air purifier, then run following command.

   ```
   miio discover
   ```

3. You may need to wait few minutes until you get the response similar to below:

   ```
   Device ID: 127261362
   Model info: Unknown
   Address: 10.0.1.3
   Token: ???
   Support: Unknown
   ```

## Device Token (token)
This is no so straight forward but it shouldn't be to hard either. I don't plan to keep and updated tutorial on this but there a lot of good ones online so you can use google to find them.

A very comprehensive one can be found [here](https://github.com/Maxmudjon/com.xiaomi-miio/blob/master/docs/obtain_token.md) 

## PM2.5 AQI Breakpoints (pm25_breakpoints)
In the default Home App, automations are limited to air quality sensor's reported AQI and not on the numeric PM2.5 density.

HomeKit has 5 values for air quality. The air quality sensor will switch between them based on the current PM2.5 density:

 - **Excellent**:  PM2.5 is up to ***5***
 - **Good** : PM2.5 is over 5, up to ***12***
 - **Fair** : PM2.5 is over 12, up to ***35***
 - **Inferior**: PM2.5 is over 35, up to ***55***
 - **Poor**: PM2.5 is over 55

You can define your own limits by using the *pm25_breakpoints* option:
```
"pm25_breakpoints": [5, 12, 35, 55]
```

*NOTE*: You can use 3rd party apps like EveHome or Home+ if you want to create PM2.5 triggered automations.
