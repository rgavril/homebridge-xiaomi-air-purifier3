# homebridge-xiaomi-air-purifier3
Homebridge plugin for controlling Xiaomi Air Purifier 3/3H



# Installation
1. Install homebridge using: npm install -g homebridge
2. Install homebridge-xiaomi-air-purifier3 using: npm install -g homebridge-xiaomi-air-purifier3

# Configuration
Sample configuration:
```
"accessories": [
        {
            "accessory": "XiaomiAirPurifier3",
            "name": "Xiaomi Air Purifier",
            "did": "XXXXXXXXX",
            "ip": "10.0.X.X",
            "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
]
```
Fields:
* "accessory": Must always be "XiaomiAirPurifier3" (required)
* "name": Name that will be displayed in your home app (required)
* "did": The device id of the air purifier (required)
* "ip": Ip address of the air purifier (required)
* "token": The device token of the air purifier (required)

# How to find the did (device id) and ip address

IMPORTANT: I recommend that you assign a static ip address to the device to avoid getting a different ip address from you router.

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

# How to find the token
This is no so straight forward but it shouldn't be to hard either. I don't plan to keep and updated tutorial on this
but there a a lot of good ones online so you can use google to find them.

A very comprehensive one can be found [here](https://github.com/Maxmudjon/com.xiaomi-miio/blob/master/docs/obtain_token.md) 