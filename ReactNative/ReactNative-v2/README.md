### Clean cache
npm start -- --reset-cache

### Chạy câu lệnh để copy folder theme của native-base ra thực hiện chỉnh sửa nếu cần thiết
node node_modules/native-base/ejectTheme.js

### Tạo folder ios và android để thực hiện build (nếu chưa có)
react-native eject

### Install and link NativeBase and react-native-vector-icons
1.  Run:

    npm install native-base --save
    npm install react-native-vector-icons --save
    react-native link

2. Add line in module dependencies of file \android\app\build.gradle

    compile project(':react-native-vector-icons')