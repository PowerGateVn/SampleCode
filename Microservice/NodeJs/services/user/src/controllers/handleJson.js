import { createUser } from '../businessLogic/user';
export async function main(event, context, callback) {
    // Process kinesis event
    if (!event.Records) { return callback(null, `Successfully processed ${event.Records.length} records.`); }
    event.Records.forEach(async (record) => {
        const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        const data = JSON.parse(payload);
        if (!data.email) {
            return false;
        };
        await createUser(data);
        // do stuff with negative AMOUNT
        console.log('NEGATIVE decoded record:', payload);
    });
    return callback(null, `Successfully processed ${event.Records.length} records.`);
}