
function water() {
    const can = document.getElementById('#delete');
    can.addEventListener("onclick", (e) => {
            const lastWatered = req.body.lastWatered;
            const today = new Date();
            plant.lastWatered = today;
            console.log(plant);
            plant.save();
        });
    console.log('Can: ' + can);
}

water();