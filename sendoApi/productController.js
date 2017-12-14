const productsModel = require('./productsModel');
var async = require('async');
const cheerio = require('cheerio');
var request = require('request');
var createProduct = (data, callback) => {
          productsModel.create(data, (err, doc) => {
            if (err) {
              console.log('error message', err.errmsg);
              callback(data.name + "  "  + err);
            } else {
              callback(null,doc);
            }
          })
  }
var urlShop;
var arrDetailProduct = new Array();
var arrProduct = new Array();
var c = 0;
var productCount = 0;
var checkLength = 0;
var dem = 0;
var length =0;
var arrCategories = new Array();
var checkCountLink =0;
var getInfoProduct = (url,callback) =>{
  request(url,(errProduct,responeProduct,bodyProduct)=>{
    var product = {
      name : '',
      currentPrice: "",
      link : '',
      wireHouse : '',
      title1 : 'a',
      title2 : 'a',
      title3 : 'a',
      linkProduct: ''
    }
    product.linkProduct = url;
    product.link = urlShop;
    if(bodyProduct){
      console.log('bắt đầu');
      const html = cheerio.load(bodyProduct);
      // name of product
      html(".end").each(function(numProduct,dataProduct){
        product.name = dataProduct.children[0].children[0].data;
        console.log(product.name);
      });
      // curent price
      html(".current_price").each(function(numProduct,dataProduct){
        product.currentPrice = dataProduct.children[0].children[0].data;
      });
      // kho hàng
      html(".wirehouse").each(function(numProduct,dataProduct){
        product.wireHouse = dataProduct.children[2].data;
      });
      // old price
      html(".old_price").each(function(numProduct,dataProduct){
        product.oldPrice=dataProduct.children[0].data.replace("Giá cũ: ","");
      });
      // title 1
      html(".breadcrumb-shop").each(function(numProduct,dataProduct){
        product.title1=dataProduct.children[5].children[1].attribs.title;
      });
      // title 2
      html(".breadcrumb-shop").each(function(numProduct,dataProduct){
        if(dataProduct.children[9] !== undefined)
        product.title2 = dataProduct.children[9].children[1].attribs.title;
      });
      // title 3
      html(".breadcrumb-shop").each(function(numProduct,dataProduct){
        if(dataProduct.children[13] !== undefined)
        product.title3 = dataProduct.children[13].children[1].attribs.title;
      });
      // Img 1
      html("#zoom_detail").each(function(numProduct,dataProduct){
         product.urlImg= dataProduct.attribs.src;
      });
      arrProduct.push(product);
      c++;
      console.log(c);
      if(c == productCount ){
        console.log(arrProduct.length);
        async.everyLimit(arrProduct,15,(data,cb) =>{
            createProduct(data,(error,done) =>{
              if(error) console.log(error);
              console.log("done");
              cb(null,true);
            })
        },(er,resp) =>{
          if(er) console.log(er);
          arrDetailProduct = [];
          arrProduct = [];
           c = 0;
          productCount = 0;
          checkLength = 0;
          length =0;
          arrCategories = new Array();
          checkCountLink =0;
          dem =0;
          console.log("done all");
        })
      }
      callback(null,c);
    }else{
      c++;
      console.log("lỗi rq");
    }
  })
}  


const doneAll = (url) => {  
  urlShop = url;
  var listProductArr = new Array();
    request(url,(err,response,body) =>{
      if(err){
      }else{
        if(body){
          const $ = cheerio.load(body);
          $(".cate_shop_in_detail").each(
            function(index,div){
            div.children.forEach((doc,num) =>{
              if(doc.attribs !== undefined){
                if(doc.attribs.class == "ttl-shop "){
                }else{
                doc.children.forEach((data,count) =>{
                  if(data.attribs !== undefined){
                    if(data.attribs.class == 'ttl-block'){
                    }else{
                      data.children[0].next.children.forEach((element,number) =>{
                        if(element.next !== null){
                          if(element.next.children !== undefined){
                            listProductArr.push(element.next.children[0].next.children[0].children[0].next.next.parent.attribs.href);
                          }
                        }
                      })
                    }
                  }
                })
              }
              }else{
              }
              if(num == div.children.length-1){
                checkPage(listProductArr);
              }
            })
          })
        }else{
          console.log("don't have body");
        }
      }
    })
}

var checkEachPage = (url) =>{
  request(url,(err,response,body) =>{
    if(body){
      const $ = cheerio.load(body);
      var check =	$('.next.shop_bg_color_hover');
      if(check[0] !== undefined){
        $('.next.shop_bg_color_hover').each(function(index,data){
          if(index == 0){
            arrCategories.push(data.attribs.href);
            checkEachPage(data.attribs.href);
          }
        })
      }else{
        checkLength++;
      }
      if(checkLength ==  length){
        console.log(arrCategories);
        console.log(arrCategories.length);
        countProduct(arrCategories);
      }
    }
  })
}

var checkPage = (arr) => {
  arrCategories = arr;
  length = arr.length;
  console.log("there are " + length + "categories");
  arr.forEach((url) => {
    checkEachPage(url);
  })
}


var countProduct = (arr) =>{
  console.log(arr.length + " links need to rq");
  async.everyLimit(arr,1,(data,callback) =>{
    request(data,(err,response,body) =>{
      if(err){
        console.log("vui lòng thử lại");
      }else{
        if(body){
        const $ = cheerio.load(body);
        var html = new Array();
        html.push($('.img_product'));
        productCount = productCount + html[0].length;
        dem ++;
        console.log(productCount + "   " + dem);
        if(dem == arr.length){
         console.log('start get link');
         getLinkDetail(arr);
        }
        }
      }
      callback(null,true);
    })
  })
}
var getLinkDetail = (arr) =>{
  arr.forEach((data,index) =>{
    request(data,(err,response,body) =>{
      if(err){
        console.log("lỗi rq,thử lại!");
      }else{
        if(body){
        const $ = cheerio.load(body);
        $('.img_product').each(function(index,data){
          checkCountLink ++;
          console.log(checkCountLink);
          arrDetailProduct.push(data.attribs.href);
          if(checkCountLink == productCount){
            console.log("links: " + arrDetailProduct.length);
            console.log("start get detail");
            async.everyLimit(arrDetailProduct,3,getInfoProduct,(err,doc) =>{
              console.log("hj");
            })
          }
        })
        }
      }
    })
  })
}

module.exports = {
    createProduct,
    getInfoProduct,
    doneAll
  }