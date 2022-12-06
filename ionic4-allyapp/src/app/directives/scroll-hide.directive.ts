import { IonContent, DomController } from '@ionic/angular';
import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';
// import { ScrollHideConfig } from '../interfaces/scroll-hide-config';
@Directive({
    selector: '[appScrollHide]'
})
export class ScrollHideDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('appScrollHide') config: any;
    @Input() scrollContent: IonContent;
    @Input() subHeaderAbsorlute: HTMLElement;
    @Input() subHeaderDirective: HTMLElement;
    contentHeight: number;
    scrollHeight: number;
    lastScrollPosition: number;
    lastValue = 0;
    state: any;
    offsetTopSubHeader: number;
    constructor(private element: ElementRef, private renderer: Renderer2, private domCtrl: DomController) {
        this.lastScrollPosition = 0;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnChanges(changes: SimpleChanges) {
        if (this.scrollContent && this.config) {
            this.scrollContent.scrollEvents = true;
            const scrollStartFunc = async (ev) => {
                const offsetTopSubHeader = Math.abs(this.subHeaderDirective.offsetTop);
                if (offsetTopSubHeader > 0 && this.offsetTopSubHeader !== offsetTopSubHeader) {
                    // console.log('offsetTopSubHeader: ', offsetTopSubHeader);
                    this.offsetTopSubHeader = offsetTopSubHeader;
                }
                const el = await this.scrollContent.getScrollElement();
                this.contentHeight = el.offsetHeight;
                this.scrollHeight = el.scrollHeight;

                // if (this.config.maxValue === undefined) {
                this.config.maxValue = this.element.nativeElement.offsetHeight;
                // console.log('this.config.maxValue: ', this.config.maxValue);
                // }
                // this.lastScrollPosition = el.scrollTop;
            };
            if (this.scrollContent && this.scrollContent instanceof IonContent) {
                this.scrollContent.ionScrollStart.subscribe(scrollStartFunc);
                this.scrollContent.ionScroll.subscribe(async (ev: any) => this.adjustElementOnScroll(ev, 'scrolling'));
                this.scrollContent.ionScrollEnd.subscribe(async (ev: any) => this.adjustElementOnScroll(ev, 'end'));

            } else if (this.scrollContent instanceof HTMLElement) {
                (this.scrollContent as HTMLElement).addEventListener('ionScrollStart', scrollStartFunc);
                (this.scrollContent as HTMLElement).addEventListener('ionScroll',
                    async (ev) => this.adjustElementOnScroll(ev, 'scrolling'));
                (this.scrollContent as HTMLElement).addEventListener('ionScrollEnd', async (ev) => this.adjustElementOnScroll(ev, 'end'));
            }
        }
    }
    private adjustElementOnScroll(ev, state) {
        if (ev) {
            this.domCtrl.write(async () => {
                const el = await this.scrollContent.getScrollElement();
                const scrollTop: number = el.scrollTop > 0 ? el.scrollTop : 0;
                const scrolldiff: number = scrollTop - this.lastScrollPosition;
                this.lastScrollPosition = scrollTop;
                let newValue = this.lastValue + scrolldiff;
                newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
                // this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
                const headerHeight = 64;
                const tabHeight = 0;
                // if (state === 'end' || (scrollTop + this.contentHeight + headerHeight + tabHeight + 24) > this.scrollHeight) {
                if ((scrollTop + this.contentHeight + headerHeight + tabHeight + 24) > this.scrollHeight) {
                    // this.handleAddSubHeader(scrollTop);
                    // this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `0px`);
                    // this.renderer.setStyle(this.element.nativeElement, '-webkit-transition', `all 0.2s`);
                    this.returnDom(state, newValue);
                    return;
                }
                if (scrollTop <= 0) {
                    // this.handleAddSubHeader(scrollTop);
                    this.returnDom(state, newValue);
                    return;
                }
                if (newValue > 0 && this.state !== 'end') {
                    // } else if (newValue !== 0) {
                    // scrolldown
                    // this.handleAddSubHeader(scrollTop);
                    this.renderer.addClass(this.subHeaderAbsorlute, 'hide-tab-sub-header');
                    this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-44px`);
                    this.renderer.setStyle(this.element.nativeElement, '-webkit-transition', `all 0.0s`);
                    this.renderer.setStyle(this.element.nativeElement, 'transition', `all 0.0s`);
                    this.renderer.setStyle(this.element.nativeElement, "opacity", "0");
                } else if (isNaN(newValue) || newValue <= 0) {
                    // scroll up
                    this.handleAddSubHeader(scrollTop);
                    this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `0px`);
                    this.renderer.setStyle(this.element.nativeElement, '-webkit-transition', `all 0.0s`);
                    this.renderer.setStyle(this.element.nativeElement, 'transition', `all 0.0s`);
                    this.renderer.removeStyle(this.element.nativeElement, "opacity");
                }
                this.returnDom(state, newValue);
            });
        }
    }
    returnDom(state: any, newValue: number) {
        this.state = state;
        this.lastValue = newValue;
        return;
    }
    async handleAddSubHeader(scrollTop: number) {
        // return;
        if (scrollTop > this.offsetTopSubHeader) {
            this.renderer.removeClass(this.subHeaderAbsorlute, 'hide-tab-sub-header');
        } else {
            this.renderer.addClass(this.subHeaderAbsorlute, 'hide-tab-sub-header');
        }
        this.config.maxValue = this.element.nativeElement.offsetHeight;
    }
}
