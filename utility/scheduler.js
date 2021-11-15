async function Schedule(task = async function(){}, minutes) {
    await Delay(1);
    task();
    await Delay(minutes);
}

async function Delay(minutes) {
    return new Promise((resolve) => setTimeout(resolve, minutes * 60 * 1000));
}

exports.Schedule = Schedule;