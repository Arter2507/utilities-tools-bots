@echo off
setlocal enabledelayedexpansion

REM Khởi tạo biến đếm cho từng loại
set /a count_img=1
set /a count_gif=1
set /a count_audio=1
set /a count_video=1
set /a count_other=1

REM Đổi tên tất cả file thành tên tạm để tránh đụng tên, trừ file .bat
for %%f in (*.*) do (
    set "ext=%%~xf"
    set "name=%%~nxf"
    set "full=%%~f"

    REM Bỏ qua file .bat (chính script này)
    if /I not "!ext!"==".bat" (
        ren "%%f" "__temp_%%~nxf"
    )
)

REM Đổi lại tên chính thức từ temp
for %%f in (__temp_*) do (
    set "ext=%%~xf"
    set "lowerext=!ext:~1!"
    set "type="
    set "id="

    REM Xác định loại file và đếm số thứ tự riêng
    if /I "!lowerext!"=="jpg" (
        set "type=img"
        set /a id=!count_img!
        set /a count_img+=1
    ) else if /I "!lowerext!"=="jpeg" (
        set "type=img"
        set /a id=!count_img!
        set /a count_img+=1
    ) else if /I "!lowerext!"=="png" (
        set "type=img"
        set /a id=!count_img!
        set /a count_img+=1
    ) else if /I "!lowerext!"=="gif" (
        set "type=gif"
        set /a id=!count_gif!
        set /a count_gif+=1
    ) else if /I "!lowerext!"=="mp3" (
        set "type=audio"
        set /a id=!count_audio!
        set /a count_audio+=1
    ) else if /I "!lowerext!"=="m4a" (
        set "type=audio"
        set /a id=!count_audio!
        set /a count_audio+=1
    ) else if /I "!lowerext!"=="mp4" (
        set "type=video"
        set /a id=!count_video!
        set /a count_video+=1
    ) else if /I "!lowerext!"=="mkv" (
        set "type=video"
        set /a id=!count_video!
        set /a count_video+=1
    ) else (
        set "type=other"
        set /a id=!count_other!
        set /a count_other+=1
    )

    REM Tạo tên mới theo định dạng yêu cầu
    if "!type!"=="img" (
        set "newname=IMG_!id!!ext!"
    ) else (
        set "newname=Another_File_!type!_!id!!ext!"
    )

    ren "%%f" "!newname!"
)

echo Đã đổi tên tất cả file thành công, loại nào đếm riêng loại đó!
pause
