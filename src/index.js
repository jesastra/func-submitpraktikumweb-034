const mysql = require('mysql2/promise');

module.exports = async function (context, myBlob) {
    // Membaca nama file yang baru diunggah
    const fileName = context.bindingData.name;
    context.log(`Proses otomatis berjalan. File baru masuk: ${fileName}`);

    // Mendapatkan URL file
    const fileUrl = `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/tugas-praktikum/${fileName}`;

    // Koneksi ke Azure MySQL menggunakan Environment Variables
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'db_praktikumsubmit',
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Memperbarui status pengumpulan menjadi Submitted
        await conn.execute("UPDATE submissions SET status = 'Submitted' WHERE file_url = ?", [fileUrl]);
        context.log("Status tugas berhasil diubah ke Submitted!");
    } catch (error) {
        context.log.error("Gagal update database:", error);
    } finally {
        await conn.end();
    }
};