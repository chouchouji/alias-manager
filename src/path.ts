class StorePath {
  private _path = '';

  get path() {
    return this._path;
  }

  set path(path: string) {
    this._path = path;
  }
}

export default new StorePath();
