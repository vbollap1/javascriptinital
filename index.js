var links_array = [
  {"name":"CloudFlare", "url":"https://www.cloudflare.com/"}, 
  {"name":"UMBC", "url":"https://www.umbc.edu/"}, 
  {"name":"LPU", "url":"https://www.lpu.in/"}
];


var svg =[{"svg":"https://i.ibb.co/sJY3bjg/twitter.png", "url":"https://twitter.com/Cloudflare?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"},
{"svg":"https://i.ibb.co/sW3Nz98/linkedin.png","url":"https://www.linkedin.com/in/vinay-bollapu-45354b161/"},
{"svg":"https://i.ibb.co/CVYBDVD/newyorktimes.png","url":"https://www.nytimes.com/"}];

class ProfileStyleHandler {
  element(element) {
    element.setAttribute('style', '')
  }
}

class TitleTagHandler {
  element(element) {
    element.setInnerContent('Vinay Bollapu')
  }
}

class HeaderHandler {
  element(element) {
    element.setInnerContent('Vinay Bollapu')
    element.setAttribute('style', 'color:black')
  }
}

class SocialDivHandler {
  element(element) {
    element.setAttribute('style', '')
    svg.forEach(svgicon => {
      element.append(`<a href="${svgicon['url']}"><img src ="${svgicon['svg']}"/></a>`, { html: true })
    });
    
  }
}

class ImageHandler {
  element(element) {
    element.setAttribute('src', 'https://i.ibb.co/Dwzb91T/download.png') 
  }
}

class LinksTransformer {
  constructor(links_array) {
    this.links_array = links_array
  }

  element(element) {
    this.links_array.forEach(e => {
      var name = e["name"] 
      var url = e["url"]
      element.append(`<a href="${url}">${name}</a>`, { html: true })
    });
  }
}

class BodyDivHandler {
  element(element) {
    element.setAttribute('style', 'background-color:#BEE3F8')
  }
}



addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  console.log("url hit:", request.url)

  var url = request.url.toString();
  var urlpieces = url.split('/')
  
  if(urlpieces[3] == 'links') {
    return new Response(JSON.stringify(links_array), {
      headers: { 'content-type': 'application/json' },
    })
  } else {
    var res = await fetch("https://static-links-page.signalnerve.workers.dev/");
    
    const rewriter = new HTMLRewriter()
      .on("div#links",  new LinksTransformer(links_array));
    res = rewriter.transform(res);

    const profileRewriter = new HTMLRewriter()
      .on("div#profile",  new ProfileStyleHandler());
    res = profileRewriter.transform(res);

    const headerRewriter = new HTMLRewriter()
      .on("h1#name",  new HeaderHandler());
    res = headerRewriter.transform(res);

    const imageRewriter = new HTMLRewriter()
    .on("img#avatar",  new ImageHandler());
    res = imageRewriter.transform(res);

    const socialhandler = new HTMLRewriter()
    .on("div#social",  new SocialDivHandler());
    res = socialhandler.transform(res);

    const bodyhandler = new HTMLRewriter()
    .on("body",  new BodyDivHandler());
    res = bodyhandler.transform(res);

    const titlehandler = new HTMLRewriter()
    .on("title",  new TitleTagHandler());
    res = titlehandler.transform(res);

    return res;
  }

}
