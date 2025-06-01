class UrlParser {
  static parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  }

  static parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    return this._urlSplitter(url);
  }

  static _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  }

  static _urlCombiner(splitedUrl) {
    return (splitedUrl.resource ? `/${splitedUrl.resource}` : '/') +
      (splitedUrl.id ? '/:id' : '') +
      (splitedUrl.verb ? `/${splitedUrl.verb}` : '');
  }
}

export default UrlParser;