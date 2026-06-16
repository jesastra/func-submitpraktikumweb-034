const { app } = require('@azure/functions');

app.storageBlob('UpdateStatusTugas', {
    path: 'tugas-praktikum/{name}',
    connection: 'sapraktikumsubmit34_STORAGE',
    handler: (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
    }
});
