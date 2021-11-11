let dog;
let george;
let water;
let illusion;
function preload() {
  // (800 x 825)
  dog = loadImage('imgs/dog.jpg');

  george = loadImage('imgs/face.jpg');

  water = loadImage('imgs/water.jpg');

  illusion = loadImage('imgs/illusion.jpg');
}

function setup() {
  createCanvas(document.body.clientWidth, windowHeight);
	//createCanvas(windowWidth, windowHeight, WEBGL); //p5 3d mode
  
  pix = 15;//distance between points
  pts = [];
  d = 15; //depth
  w = 15; //width 
  h = 0; //height
  pts = [];
  for(i=0; i<w; i++) {
    pts[i] = [];
    for(j=0; j<h; j++) {
      pts[i][j] = [];
      for(k=0; k<d; k++) {
        pts[i][j][k] = new pt(i, j, k);
      }
    }
  }

  graphs = 0;
}
function draw() {
  background(0);
  
  //mouse movement
  sx = width/2-mouseX;
  sy = height/2-mouseY;
  //draw all points
  //depth, width, height drawing order
  for(i=0; i<d; i++) {
    //overlap correction
    //right
    if(sx > 0) {
      for(j=0; j<w; j++) {
        for(k=0; k<h; k++) {
          pts[j][k][i].draw();
        }
      } 
    } else {
    //left
      for(j=w; j>=0; j--) {
        for(k=0; k<h; k++) {
          pts[j][k][i].draw();
        }
      }
    }
  }

  //i = x then j = z
  //go through all flat planes
  for(i=0; i<d; i++) {
    for(j=0; j<w; j++) {
      //if not outside of the edge
      if(j < w && i < d) {
        // 1 2
        // 3 4
        render(j, i, j+1, i, j, i+1, j+1, i+1);
      }
    }
  }

}
function render(ax, az, bx, bz, cx, cz, dx, dz) {
  let ay = f(ax, az);
  let by = f(bx, bz);
  let cy = f(cx, cz);
  let dy = f(dx, dz);
  /*
  let x = this.x;
    let y = this.y;
    x += sx*(d/2-this.z)/100;
    y += sy*(d/2-this.z)/100;
  */
  //angle adjust
  let nax = ax + sx*(d/2-az)/100;
  let nay = ay + sy*(d/2-az)/100;
  let nbx = bx + sx*(d/2-bz)/100;
  let nby = by + sy*(d/2-bz)/100;
  let ncx = cx + sx*(d/2-cz)/100;
  let ncy = cy + sy*(d/2-cz)/100;
  let ndx = dx + sx*(d/2-dz)/100;
  let ndy = dy + sy*(d/2-dz)/100;
  strokeWeight(0);
  stroke(255);

  //George's home

  let v1 = createVector(ax,az,ay);
  let v2 = createVector(bx,bz,by);
  let v3 = createVector(cx,cz,cy);

  let va = createVector(v2.x - v1.x, v2.y - v1.y, v2.z, v1.z);
  let vb = createVector(v3.x - v1.x, v3.y - v1.y, v3.z, v1.z);
  let vt = va.cross(vb);
  let k = sqrt(vt.x*vt.x+vt.y*vt.y+vt.z*vt.z);
  let vm = createVector(vt.x / k, vt.y / k, vt.z / k);

  //THIS IS THE SHADER variable

  //LIGHT VECTOR
  let vs = createVector(0,0,1);

  let num = vm.dot(vs);

  //let num = (vm.dot(vs) + 1) / 2;
  /*
  if(ax == w/2 && az == d/2) {
    arc(75, 85, 50, 50, -PI/2, -PI/2+PI/2*num);
    text(num, 50, 50);
  }
  */
  
  //GREEN
  //fill(50+50*num, 50+500*num, 250 * num);
  
  //SPARKLE
  //let sparkle = 100*sin((ax + az)*frameCount);
  //fill(sparkle, 50+500*num - sparkle, 250 * num + sparkle);

  //ORANGE
  //fill(255, 100+500*num, 500 * num);

  //BLUE PRINT
  //fill(50+50*num, 50+500*num, 200+50*num);

  //RANDOM

  //fill(random()*255);
  //fill(random()*255, random()*255, random()*255);
  //adjust for screen size
  
  //HEAT MAP RED TO PURPLE
  let netY = (ay+by+cy+dy)/(4);//20 is max conveniant height
  fill(log(netY)*50, 0, 255 - 50 * log(netY));
  //YEAHHHHH ITS ALIVE!!! TRY 3
  let pic = george;
  fill(pic.get(pic.width * ax/w, pic.height * az/d));
    /*
    quad(
    width/2-pix*w/2+pix*nax, height/2-pix*h/2+pix*nay, 
    width/2-pix*w/2+pix*nbx, height/2-pix*h/2+pix*nby, 
    width/2-pix*w/2+pix*ndx, height/2-pix*h/2+pix*ndy,
    width/2-pix*w/2+pix*ncx, height/2-pix*h/2+pix*ncy 
    );
    */

  //DETAILED PIXELS
  let ppp = 2;//(PIXELS PER PIXEL LENGTH)
  //WIDTH HEIGHT 2D ARRAY
  for(let i=0; i<=1; i+=1/ppp) {
    for(let j=0; j<=1; j+=1/ppp) {
      fill(pic.get(pic.width * (ax+i)/w, pic.height * (az+j)/d));
      //SUB PIXEL POINTS
      
      let sax = width/2-pix*w/2+pix*nax;
      let say = height/2-pix*h/2+pix*nay;
      let sbx = width/2-pix*w/2+pix*nbx;
      let sby = height/2-pix*h/2+pix*nby;
      let scx = width/2-pix*w/2+pix*ncx;
      let scy = height/2-pix*h/2+pix*ncy;
      let sdx = width/2-pix*w/2+pix*ndx;
      let sdy = height/2-pix*h/2+pix*ndy;
      
      
      quad(
      sax+(sax-sax), say+(say-say), 
      sax+(sax-sbx)*i, say+(say-sby)*j, 
      sax+(sax-sdx)*i, say+(say-sdy)*j, 
      sax+(sax-scx)*i, say+(say-scy)*j
      );
      
    }
  }
  
  /*
  image(dog, 
    width/2-pix*w/2+pix*nax, height/2-pix*h/2+pix*nay, 
    width/2-pix*w/2+pix*nbx, height/2-pix*h/2+pix*nby, 
    width/2-pix*w/2+pix*ndx, height/2-pix*h/2+pix*ndy,
    width/2-pix*w/2+pix*ncx, height/2-pix*h/2+pix*ncy
  );
  */

  //let a = 50+50*cos(frameCount/200);
  // image file, posx, posy, wid, hei, subx, suby, zoomx, zoomy
  //image(dog, 50, 50, 350, 350, 0, 0, 1000, 1000, frameCount, frameCount, 1);

    fill(100,100,200);
}
class pt extends p5.Vector {
  constructor(x, y, z) {
    super(x, y, z);
    this.s = 10/pow(d-z, 1/4);
    this.disp = false;
  }
  draw() {
    let x = this.x;
    let y = this.y;
    x += sx*(d/2-this.z)/100;
    y += sy*(d/2-this.z)/100;
    let s = this.s;
    
    noStroke();
    fill(255*this.z/d);
    if(this.y > f(this.x, this.z)) {
      this.disp = true;
    }

    if(this.disp) {
      //circle(width/2-pix*w/2+pix*x, height/2-pix*h/2+pix*y, s);
    }
  }
}
function f(x, z) {
  let sf = frameCount/40; //SCALES TIME FOR FRAMES AND STUFF
  let y = 0;
  //y = 5+4*cos(z)+2*cos(x);
  //y = sqrt(x*x*x+z*z*z)-15;
  //y = pow(sqrt(1+cos(x)), z)-5;
  //y = pow(x*x+z*z, 1/3);
  //let s = 0.5;//1+cos(frameCount/50);
  //let sh = frameCount/20;
  //y = s*z*(5+1*cos(x/4+3+sh))-15;
  //y = 5+4*cos((z*x)/50 + frameCount/20) + 2*sin((z/x)/50 + frameCount/5);
  
  //y = -pow((x-10)/4, 2) + z/5;
  //y = -160+15*sqrt(-pow(x/5, 2)+25)+15*sqrt(-pow(z/5, 2)+25);
  //y = 5+5*cos(x/4)+5*cos(z/4);

  //GOOSE CURVE
  /*
  let e = 2.5+0.5*cos(sf/5);
  let a = 2.5+2.5*cos(sf/2);
  let zp = d/10+d/10*sin(sf/2);
  let ym = 7+7*sin(sf/2);
  y = -10-ym*pow(e, -pow((x-w/2)/a, 2)-pow((z-d/5)/a-zp, 2));
  
*/
  //RIPPLE
  /*
  let rs = 4*sf;
  let ym = 5 * pow(0.70, dist(w/2, d/2, x, z));
  y = -5 - ym*cos(dist(w/2, d/2, x, z)-rs);
  
*/    
  //SINKIN SINKHOLE
  /*
  let o = 10+10*cos(2*sf);
  y = 1/(pow((w/2-x)/o, 2)+pow((d/2-z)/o, 2)) + sin(dist(w/2, d/2, x, z)+2*sf);
  */
  if(graphs == 0) {
    y = -5;
  }
  if(graphs == 1) {
    y = goose(x, z);
  }
  if(graphs == 2) {
    y = ripple(x, z);
  }
  if(graphs == 3) {
    y = sinkhole(x, z);
  }
  if(graphs == 4) {
    y = ball(x, z);
  }
  if(graphs == 5) {
    y = invertedsink(x, z);
  }
  if (graphs == 6) {
    y = jonathanMethod(x, z);
  }
  if (graphs == 7) {
    y = poly(x, z);
  }

  return y;
}
function goose(x, z) {
  let sf = frameCount/40; //SCALES TIME FOR FRAMES AND STUFF
  let y = 0;
  let e = 2.5+0.5*cos(sf/5);
  let a = 2.5+2.5*cos(sf/2);
  let zp = d/10+d/10*sin(sf/2);
  let ym = 7+7*sin(sf/2);
  y = -5-ym*pow(e, -pow((x-w/2)/a, 2)-pow((z-d/5)/a-zp, 2));
  return y;
}
function ripple(x, z) {
  let sf = frameCount/40; //SCALES TIME FOR FRAMES AND STUFF
  let y = 0;
  let rs = 4*sf;
  let ym = 10 * pow(0.70, dist(w/2, d/2, x, z));
  y = -5 - ym*cos(dist(w/2, d/2, x, z)-rs);
  return y;
}
function sinkhole(x, z) {
  let sf = frameCount/40; //SCALES TIME FOR FRAMES AND STUFF
  if(x == w/2 && z == d/2) {
    x += 0.1;
    z += 0.1;
  }
  let y = 0;
  let o = 10+10*cos(2*sf);
  y = 1/(pow((w/2-x)/o, 2)+pow((d/2-z)/o, 2));// + sin(dist(w/2, d/2, x, z)+2*sf);

  return y;
}


function ball(x, z) {
  let r = 10;//10+1*cos(frameCount/20);
  //let y = -15 + pow(dist(w/2, d/2, x, z-10), 1.1);
  let y = r - sqrt(-((w/2-x)*(w/2-x))+r*r) - sqrt(-((d/2-z)*(d/2-z))+r*r);
  return y;
}

function invertedsink(x, z) {
  let sf = frameCount/80; //SCALES TIME FOR FRAMES AND STUFF
  let y = 0;
  let o = 10+10*cos(2*sf);
  y = 1/(pow((w/2-x)/o + 1, 3)+pow((d/2-z)/o - 1, 3));// + sin(dist(w/2, d/2, x, z)+2*sf);
  if(x == w/2 && z == d/2) {
    y = 1/(pow(((w+0.1))/2-(x+0.1))/o, 2)+pow((d/2-(z+0.1)/o, 2));
  }
  return y;
}
function jonathanMethod(x, z) {
  let y;
  y = log(x)*z*sin(frameCount/10);
  return y;
}

function poly(x, z) {
  let cx = w/2-x;
  let cz = d/2-z;

  let y = -5 + ((cx-7)*(cx+7)*(cx)*cos(frameCount/35) + (cz-3)*(cz)*(cz + cx)*sin(frameCount/60))/100;
  return y;
}


function keyPressed() {
  if(key == '1') {
    graphs = 1;
  }
  if(key == '2') {
    graphs = 2;
  }
  if(key == '3') {
    graphs = 3;
  }
  if(key == '4') {
    graphs = 4;
  }
  if(key == '5') {
    graphs = 5;
  }
  if(key == '6') {
    graphs = 6;
  }
  if(key == '7') {
    graphs = 7;
  }

  //MAGNIFY
  if(key == '=') {
    pix *= 1.2;
  }
  if(key == '-') {
    pix /= 1.2;
  }
}