Base on laravel 5.4
0. Run composer update
1. Design pattern repository for each module in packages folder

2. In each module use ServiceProvider
+ Create new ServiceProvider for each module
+ Register ServiceProvider on config/app.php/providers

3. Config for each Env
+ .env
+ config/mail.php
+ public/.htaccess
+ config route at module route : ex: packages/infos/users/src/routes.php

+ Config code response at config/constants.php
+ data mock database/users.sql

4. Use login_token
Config in File : packages/infos/users/src/Middleware/IsLoginMiddleware.php

Having 3 way to post login_token to server
1. Get: domain?login_token=$login_token
2. Post : login_token=$login_token
3. Header : login_token=$login_token

5. Config cros domain :
- Middleware : cors
- Config in File : app/Http/Middleware/CorsMiddleware.php

6. Config domain point to folder public/