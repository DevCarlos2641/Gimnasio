export class Carousel{
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplaySpeed: 2000,
    margin: 10,
    pullDrag: true,
    dots: true,
    navSpeed: 1000,
    navText: [`<span class='imgNav'><</span>`,`<span class='imgNav'>></span>`],
    nav: true
  };

  getImages(l:number){
    const path = "./../../assets/images/Gym";
    let images = [];
    for(let i = 1; i <= l; i++){
      let img:Slide = {
        id: i,
        src: path+i+".jpg",
        title: "Gym"+i,
        description: "Gym"+i
      }
      images.push(img)
    }
    return images;
  }

}

interface Slide{
  id: number,
  src: string,
  title: string,
  description: string
}
