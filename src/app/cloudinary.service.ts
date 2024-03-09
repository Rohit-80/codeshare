import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Observable, of, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
declare let cloudinary: any;

const widgetUrl = 'https://widget.cloudinary.com/v2.0/global/all.js';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public createUploadWidget(data: any, callback: (error: any, result: any) => void): Observable<any> {
    return this.skriptExists(widgetUrl)
      ? of(cloudinary.createUploadWidget(data, callback))
      : fromEvent(this.addJsToElement(widgetUrl), 'load').pipe(
        map(e => cloudinary.createUploadWidget(data, callback))
      );
  }

  private skriptExists(jsUrl: string): boolean {
    return document.querySelector(`script[src="${jsUrl}"]`) ? true : false;
  }

  private addJsToElement(jsUrl: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = jsUrl;
    this.renderer.appendChild(document.body, script);
    return script;
  }
}