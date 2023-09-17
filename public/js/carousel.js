function createCarousel(sliderContainerId){
    let sliderContainer = document.querySelector(sliderContainerId);
    let innerSlider = sliderContainer.querySelector(".inner-slider");
    let imgwrap=sliderContainer.querySelector(".strip-img");

    let prevB = sliderContainer.querySelector(".btn-prev");
    let nextB = sliderContainer.querySelector(".btn-next");

    let pressed = false;
    let startX;
    let x;


    sliderContainer.addEventListener("mousedown", (e) => {
        pressed = true;
        startX = e.offsetX - innerSlider.offsetLeft;
        sliderContainer.style.cursor = "grabbing";
    });

    sliderContainer.addEventListener("mouseenter", () => {
        sliderContainer.style.cursor = "grab";
    });

    sliderContainer.addEventListener("mouseleave", () => {
        sliderContainer.style.cursor = "default";
    });

    sliderContainer.addEventListener("mouseup", () => {
        sliderContainer.style.cursor = "grab";
        pressed = false;
    });

    window.addEventListener("mouseup", () => {
        sliderContainer.style.cursor = "grab";
        pressed = false;
    });
    const checkBoundary = () => {
        let outer = sliderContainer.getBoundingClientRect();
        let inner = innerSlider.getBoundingClientRect();

        if (parseInt(innerSlider.style.left) > 0) {
            innerSlider.style.left = "0px";
        }

        if (inner.right< outer.right) {
            innerSlider.style.left = `-${inner.width - outer.width}px`;
        }

    };
    sliderContainer.addEventListener("mousemove", (e) => {
        if (!pressed) return;
        e.preventDefault();

        x = e.offsetX;

        innerSlider.style.left = `${x - startX}px`;

        checkBoundary();
    });

    let left=0;
        
    prevB.addEventListener("click", (e) => {

        left += 4*imgwrap.width;
        innerSlider.style.left =left + "px";
        checkBoundary();
    });
    
    
    
    nextB.addEventListener("click", (e) => {
        left -= 4*imgwrap.width;
        innerSlider.style.left =left + "px";
        checkBoundary();
     
        
    });
    


    

}
function getFormattedStripId(stripName){
    let sliderContainerElement = document.querySelector("#StripId");
    sliderContainerElement.id = stripName.replaceAll(/\s/g, '');
    return sliderContainerElement.id;
}



