const form = document.querySelector('#lookup-form');
const statusBox = document.querySelector('#status');
const resultBox = document.querySelector('#result');
const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resultBox.hidden = true;
  statusBox.textContent = '';
  const memberId = form.memberId.value.trim().toUpperCase();
  const phoneLast4 = form.phoneLast4.value.trim();
  if (!/^VRT\d{6}$/.test(memberId) || !/^\d{4}$/.test(phoneLast4)) {
    statusBox.textContent = 'Vui lòng nhập đúng mã thành viên và 4 số cuối điện thoại.';
    return;
  }
  const button = form.querySelector('button');
  button.disabled = true; button.textContent = 'ĐANG TRA CỨU...';
  try {
    const response = await fetch(`/api/member?memberId=${encodeURIComponent(memberId)}&phoneLast4=${encodeURIComponent(phoneLast4)}`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Không tìm thấy thông tin thành viên.');
    const earned = (data.milestones || []).filter((m) => Number(m.points) <= Number(data.member.points));
    const next = (data.milestones || []).filter((m) => Number(m.points) > Number(data.member.points)).sort((a,b) => a.points - b.points)[0];
    resultBox.innerHTML = `<div class="name">${esc(data.member.name)}</div><div class="points">${Number(data.member.points).toLocaleString('vi-VN')} điểm</div><div class="section-title">Mốc đã đạt</div>${earned.length ? earned.map((m) => `<div class="milestone"><span>✓ ${Number(m.points).toLocaleString('vi-VN')}</span><span>${esc(m.gift)}</span></div>`).join('') : '<div>Chưa đạt mốc quà.</div>'}${next ? `<div class="section-title">Mốc tiếp theo</div><div class="next">${Number(next.points).toLocaleString('vi-VN')} điểm · ${esc(next.gift)}<br><small>Còn thiếu ${Number(next.points - data.member.points).toLocaleString('vi-VN')} điểm</small></div>` : ''}`;
    resultBox.hidden = false;
  } catch (error) { statusBox.textContent = error.message; }
  finally { button.disabled = false; button.textContent = 'TRA CỨU'; }
});
