
import { NgModule } from "@angular/core";
import { CommentsComponent } from "./components/comments/comments.componet";
import { CommonModule } from "@angular/common";
import { CommentsService } from "./service/comments.service";
import { CommentFormComponent } from "./components/commentForm/commentForm.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';


@NgModule({
    imports:[CommonModule, ReactiveFormsModule,FormsModule],
    declarations:[CommentsComponent,CommentFormComponent],
    exports:[CommentsComponent],
    providers:[CommentsService]
})
export class CommentsModule{}