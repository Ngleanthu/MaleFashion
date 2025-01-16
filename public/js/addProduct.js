
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Ngăn gửi form thông thường
    const formData = new FormData(event.target); // Lấy dữ liệu form
    const successModal = document.getElementById('successModal');
    const progressBar = document.querySelector('.loading-bar__progress');

    // Hiển thị modal
    successModal.style.display = 'flex';
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    try {
        // Gửi dữ liệu đến server bằng fetch
        const response = await fetch('/create-order', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        setTimeout(() => {
            window.location.href = '/order';
        }, 2000); // Sau 2 giây
    } catch (error) {
        // Hiển thị lỗi nếu xảy ra vấn đề
        alert('Error placing order: ' + error.message);
        successModal.style.display = 'none';
        progressBar.style.width = '0%';
    }
});

function submitForm(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form (ngừng tải lại trang)

    const form = event.target;
    const formData = new FormData(form); // Tạo đối tượng FormData từ form

    // Gửi yêu cầu AJAX tới server
    fetch('/shopping-cart', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Giả sử server trả về dữ liệu JSON
    .then(data => {
        if (data.success) {
            // Xử lý kết quả trả về nếu thêm sản phẩm thành công
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
            // Bạn có thể cập nhật lại giỏ hàng ở đây mà không cần tải lại trang.
        } else {
            alert("Có lỗi xảy ra khi thêm sản phẩm!");
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Lỗi kết nối!");
    });
}
