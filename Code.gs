const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const WORKER_SECRET = PropertiesService.getScriptProperties().getProperty('WORKER_SECRET');
function doGet(e) {
  if (!SHEET_ID || !WORKER_SECRET || e.parameter.memberId == null || e.parameter.phoneLast4 == null) return json_({success:false,message:'Không tìm thấy thông tin thành viên.'});
  if (e.parameter.workerSecret !== WORKER_SECRET) return json_({success:false,message:'Unauthorized'});
  const ss = SpreadsheetApp.openById(SHEET_ID), sheet = ss.getSheetByName('KHACH_HANG');
  const rows = sheet.getDataRange().getDisplayValues(); const headers = rows.shift();
  const idx = Object.fromEntries(headers.map((h,i)=>[h,i]));
  const member = rows.find(r => r[idx.MA_THANH_VIEN] === e.parameter.memberId && String(r[idx.SO_DIEN_THOAI]).slice(-4) === e.parameter.phoneLast4 && r[idx.TRANG_THAI] === 'Hoạt động');
  if (!member) return json_({success:false,message:'Không tìm thấy thông tin thành viên.'});
  const config = ss.getSheetByName('CAU_HINH').getDataRange().getDisplayValues(); config.shift();
  return json_({success:true,member:{memberId:member[idx.MA_THANH_VIEN],name:member[idx.HO_TEN],points:Number(member[idx.TONG_DIEM]),branch:member[idx.CHI_NHANH_DANG_KY]},milestones:config.filter(r=>r[3]==='Hoạt động').map(r=>({points:Number(r[1]),gift:r[2]}))});
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
