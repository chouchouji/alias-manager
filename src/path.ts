class StorePath {
  private _path: string = '';

  get path() {
    return this._path;
  }

  set path(path: string) {
    this._path = path;
  }
}

export default new StorePath();
