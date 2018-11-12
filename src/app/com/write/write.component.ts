import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild,OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Article, Category, MediaArticle } from 'src/app/model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {

  article:Article = new Article();
  medias: Array<MediaArticle> = new Array<MediaArticle>();
  loadedPhoto:boolean = false;
  imgRwd: Array<File> = new Array();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  catCtrl = new FormControl();
  filteredCats: Observable<string[]>;
  cats: Array<string> = new Array<string>();
  allCats: Array<string> = new Array<string>();

  @ViewChild('catInput') catInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private catService:CategoryService, public snackBar: MatSnackBar) {
    this.filteredCats = this.catCtrl.valueChanges.pipe(
        startWith(null),
        map((cat: string | null) => cat ? this._filter(cat) : this.allCats.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.cats.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.catCtrl.setValue(null);
    }
  }

  remove(cat: string): void {
    const index = this.cats.indexOf(cat);

    if (index >= 0) {
      this.cats.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.cats.push(event.option.viewValue);
    this.catInput.nativeElement.value = '';
    this.catCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCats.filter(cat => cat.toLowerCase().indexOf(filterValue) === 0);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 5000,
      panelClass: ['blue-snackbar']
    });
  }

  ngOnInit() {
    this.catService.getAll().subscribe(cat=>{
      cat.forEach(el=>{
        this.allCats.push(el.CategoryName);
      })
    })
  }

  readUrlImg(event: any) {
    this.loadedPhoto = true;
    if (event.target.files && event.target.files[0]) {
      for(let i=0 ; i < event.target.files.length ; i++)
      {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          let type = event.target.result.toString().split(';')[0].indexOf('mp4') >= 0? "video":"img" ;
          this.medias.push({ MediaPath: event.target.result, MediaType:type,ArticleCode:"", Id:0 });
          this.loadedPhoto = false;
        }
        this.imgRwd.push(event.target.files[i]);
      }
    }
  }

  save(){
    console.log(this.article);
    console.log(this.cats);

    if (this.imgRwd.length == 0) {
      this.openSnackBar("Minimal 1 foto atau video untuk posting. tulisan");
      return;
    }
    var itemsProcessed = 0;
    // this.imgRwd.forEach((el, index, array) => {
    //   this.ttwService.uploadTr(el).subscribe(res => {
    //     let tr: Talkthewalk = new Talkthewalk();
    //     let urlPath:any = res;
    //     tr.URLpath = urlPath;
    //     tr.BranchCode = this.empInfo.BranchCode;
    //     tr.ProjectCode = this.empInfo.ProjectCode;
    //     tr.Username = this.empInfo.Username;
    //     tr.TRtype = 2;
    //     setTimeout(() => {
    //       this.ttwService.postTr(tr).subscribe(data => {
    //         this.stateService.setTraffic(false);
    //         itemsProcessed++;
    //         if (itemsProcessed === array.length) {
    //           this.toastr.success('', 'Dokumen berhasil tersimpan');
    //         }
    //       }, err => {
    //         this.stateService.setTraffic(false);
    //         this.toastr.error('', 'Terjadi kesalahan jaringan, Hanya beberapa foto terunggah');
    //       })
    //     }, 2000);
        
    //   }, err => {
    //     this.stateService.setTraffic(false);
    //     this.toastr.error('', 'Terjadi kesalahan jaringan');
    //   });
    // });
  }
}