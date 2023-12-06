import{Component,Input,Output,OnInit} from "@angular/core";
import{CommentsService} from '../../service/comments.service';
import { CommentInterface } from "../../types/comment.interface";
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from "@angular/forms";
import { LoginService } from '../../../login/login-component/login.service';
import { Subscription } from "rxjs";


@Component({
    selector:'comments',
    templateUrl:'./comments.component.html',
    styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
    @Input() currentUserId:string;
    @Input() postId:string;
    @Input() parentId:string;


   
    public commentList:CommentInterface[]=[];
    public commentReplies:CommentInterface[]=[];
    public fullCommentList:CommentInterface[]=[];
    commentSub:Subscription
    replySub:Subscription
    createdAt:string = '';
    
    
    constructor(private commentsService:CommentsService, public fb: FormBuilder, private titleService: Title, private data: LoginService){}

    message:string;
    status:boolean;
    ngOnInit(): void {
        const selectedPostId = this.postId;

            this.commentsService.getComments();
            this.commentSub = this.commentsService.getCommentUpdateListener().subscribe((comments: CommentInterface[]) => {
            // Filter comments based on the postId(username)
            this.commentList = comments.filter(comment => comment.postId === selectedPostId && comment.parentId === null);
            });
            this.commentsService.getReplies();
            this.replySub = this.commentsService.getCommentUpdateListener().subscribe((comments: CommentInterface[]) => {
                this.commentReplies=comments.filter(comment=>comment.parentId === this.parentId)
            });
    }

    addComment({text,parentId,postId,currentUserId}:{text:string,parentId:null|string,postId:string,currentUserId:string}):void{
        this.commentsService.createComment(text,parentId,postId,currentUserId)
    
    }

    // replySection=true;
    // getSortedReplies(comment_id:string){
    //     const replyId=comment_id
    //     this.commentsService.getReplies();
    //     this.replySub = this.commentsService.getReplyUpdateListener().subscribe((comments: CommentInterface[]) => {
    //         this.commentReplies = comments.filter(replies => replies.parentId === replyId);
    //         });
    //     console.log(this.commentReplies)
    // }
    div1:boolean = false;
    button1:boolean = true;
    button2:boolean = false;
    viewComments(){
        this.div1=true;
        this.button2=true;
        this.button1=false;
    }

    noFunc(){
        this.div1=false;
        this.button2=false;
        this.button1=true;
    }

    replyForm:boolean=false;
    reply(){
        this.replyForm = !this.replyForm;
        
    }


}