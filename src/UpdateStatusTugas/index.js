const mysql = require('mysql2/promise');

module.exports = async function (context, myBlob) {
    // 1. Membaca nama file dan waktu upload (Skenario 2)
    const fileName = context.bindingData.name;
    const waktuUpload = new Date().toISOString(); // Mendapatkan waktu saat ini

    // 2. Mencatat log upload (Skenario 2)
    context.log(`[LOG UPLOAD] Sistem mendeteksi file baru: ${fileName}`);
    context.log(`[LOG UPLOAD] Waktu upload: ${waktuUpload}`);

    const fileUrl = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/tugas-praktikum/${fileName}`;

    let conn;
    try {
        // Koneksi ke Database menggunakan env vars (ditambahkan di local.settings.json/App Settings)
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'db_praktikumsubmit',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            ssl: { rejectUnauthorized: false }
        });

        // 3. Mengubah status dari Pending menjadi Submitted di database (Skenario 1 & 2)
        await conn.execute("UPDATE submissions SET status = 'Submitted' WHERE file_url = ?", [fileUrl]);
        context.log("[LOG UPLOAD] Status pengumpulan di database berhasil diperbarui menjadi: Submitted");
    } catch (error) {
        context.log.error("Gagal update database:", error);
    } finally {
        if (conn) await conn.end();
    }
};