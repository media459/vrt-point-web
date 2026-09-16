# VRT Point

MVP tra cứu điểm thành viên VRT Point.

## Kiến trúc

- `public/`: giao diện tĩnh phục vụ bởi Cloudflare Worker.
- `src/index.js`: Worker định tuyến trang web và API `/api/member`.
- `apps-script/Code.gs`: backend đọc Google Sheet qua Apps Script Web App.

## Cấu hình

1. Tạo Google Sheet với 3 tab `KHACH_HANG`, `LICH_SU_DIEM`, `CAU_HINH`.
2. Dán `apps-script/Code.gs` vào Apps Script, đặt `SHEET_ID` và `WORKER_SECRET` trong Script Properties.
3. Triển khai Apps Script dạng Web App, chỉ cho phép tài khoản owner thực thi.
4. Đặt `GOOGLE_SCRIPT_URL` và `WORKER_SECRET` trong biến môi trường Worker.
5. Deploy Worker bằng Wrangler.

Không commit secret, Sheet ID hoặc dữ liệu khách thật vào repository.
