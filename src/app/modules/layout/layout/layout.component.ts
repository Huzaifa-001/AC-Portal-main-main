import { Component, OnInit, AfterViewInit, ElementRef, ViewChild , HostListener} from '@angular/core';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  public getScreenWidth: any;
  @ViewChild('layout')
  layout!: ElementRef;

  ngAfterViewInit (){
    this.getScreenWidth = window.innerWidth
    if(this.getScreenWidth > 992){
      this.layout.nativeElement.classList.add("sidebar-slim")
    }
    // if(this.getScreenWidth > 600 && this.getScreenWidth < 992){
    //   this.layout.nativeElement.classList.add("tablet","sidebar-slim")
    // }
    // if(this.getScreenWidth < 600){
    //   this.layout.nativeElement.classList.add("mobile")
    // }
  }

  toggleSidebar(elem:HTMLElement) {
    this.getScreenWidth = window.innerWidth
    if(this.getScreenWidth > 992){
      elem.classList.toggle("sidebar-slim")
      elem.classList.toggle("sidebar-expanded")
      // if(elem.classList.contains("sidebar-slim")){
      //   elem.classList.toggle("sidebar-slim")
      //   elem.classList.toggle("sidebar-expanded")
      // }
    }
    // if(this.getScreenWidth > 600 && this.getScreenWidth < 992 ){
    //   if(elem.classList.contains("tablet")){
    //     elem.classList.toggle("sidebar-slim")
    //   }
    // }
    // if(this.getScreenWidth < 600 ){
    //   if(elem.classList.contains("mobile")){
    //     elem.classList.toggle("sidebar-mobile-open")
    //   }
    // }
  }
}
