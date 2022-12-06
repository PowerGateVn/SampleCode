import {NgModule} from '@angular/core'
import {IonicPageModule} from 'ionic-angular'
import {TabsPage} from './tabs'
import {FeedPageModule} from '../feed/feed.module'
import {HomePageModule} from '../home/home.module'
@NgModule({
    declarations: [
        TabsPage,
    ],
    imports: [
        HomePageModule,
        FeedPageModule,
        IonicPageModule.forChild(TabsPage),
    ],
    exports: [
        TabsPage
    ]
})
export class TabsPageModule {
}
