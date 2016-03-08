script(type='text/ng-template', id='/properties.jade')
    
    block append stylesheet
        link(href='/assets/css/modules/properties.css', rel='stylesheet')
        link(href='//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/dropzone.css', rel='stylesheet')
    
    block append content
           
        .container
          .row
              .well
                h1.text-center Properties Maintenance
                |         
                #custom-search-input
                  .input-group.col-md-12
                    input.search-query.form-control(type='text', placeholder='Search')
                    |     
                    span.input-group-btn
                      button.btn.btn-danger(type='button')
                        span.glyphicon.glyphicon-search
                | 
                .list-group
                  div(ng-repeat='property in properties')   
                    a.list-group-item(href='#')
                      .media.col-md-3
                        figure.pull-left
                          div(ng-if='property.images.length > 0')
                            img.media-object.img-rounded.img-responsive(max-width='100%' max-height='100%' ng-attr-src="{{property.images[0].url}}" ng-attr-atl="http://placehold.it/250/4b8df8/000000")
                          div(ng-if='property.images.length == 0')
                            img.media-object.img-rounded.img-responsive(max-width='100%' max-height='100%' src='http://placehold.it/250/4b8df8/000000')
                          
                      |                 
                      .col-md-6
                        h4.list-group-item-heading(ng-model="property.name" ng-change="update($index)")
                        |                     
                        p.list-group-item-text.bold(ng-model='property.summary') {{property.summary}}
                        | 
                        p.list-group-item-text(ng-model='property.description')  {{property.description}}
                        | 
                        p.list-group-item-text(ng-model='property.propertyType') {{property.propertyType}}
                        | 
                        p.list-group-item-text(ng-model='property.operationType') {{property.operationType}}
                        | 
                        p.list-group-item-text(ng-model='property.address.canton') {{property.address.canton}}
                        | 
                        p.list-group-item-text.property-price(ng-model='property.price') {{property.price}}
    
                          
                      |                 
                      .col-md-3.text-center                                                          
                        //button.btn.btn-default.btn-lg.btn-block(type='button',  data-bind='click: $root.startEditingProperty.bind($data)')  Edit 
                        //|        
                        button.btn.btn-default.btn-lg.btn-block(type='button')  Disable
                        | 
                        button.btn.btn-default.btn-lg.btn-block(type='button')  Delete  
        
        
              
        p
          a.btn-floating.btn-large.waves-effect.waves-light.red
            i.mdi-content-add
            
        p
            button.btn.btn-info.btn-lg(type='button', data-bind='click: $root.prepareNewProperty.bind($data)') Create new Property
        
        
    
        //p
          span.small Don't have an account?
          span &nbsp;
          a.small(href="/register") Register now
          
    
        #successErrorSection
    
        include modals/newproperty
        include modals/editproperty
          
    
    
          
    block append script       
    
            script(type='text/javascript', src='https://maps.googleapis.com/maps/api/js')
            script(type='text/javascript', src='/assets/js/lib/resources/dropzone.js')
            
             
               