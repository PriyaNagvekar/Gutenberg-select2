/**
 * BLOCK: guten-load-post-autocomplete
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

// const { __ } = wp.i18n; // Import __() from wp.i18n
// const { AlignmentToolbar, BlockControls, registerBlockType } = wp.blocks; 
// const { RichText } = wp.editor;
// const { Autocomplete, } =wp.components;


// const MyAutocomplete = () => {
//     const autocompleters = [
//         {
//             name: 'fruit',   
//             triggerPrefix: '@',   
//             options: [
//                 {  name: 'Apple', id: 1 },
//                 {  name: 'Orange', id: 2 },
//                 {  name: 'Grapes', id: 3 },
//                 {  name: 'test', id: 4 },
//             ],

//             getOptionLabel: option => (
//                 <span>
//                   { option.name }
//                 </span>
//             ),

//             getOptionKeywords: option => [ option.name ],

//             isOptionDisabled: option => option.name === 'Grapes',

//             getOptionCompletion: option => (
//                 <abbr title={ option.name }>{ option.name }</abbr>
//             ),
//         }
//     ];

//     function onChangeAuto(newContent){
//         console.log('autocompletexx '+newContent);
//     }

//     function onSelectAuto(event){
//         console.log(event.target);
//            console.log( event.target.value);
//     }

//     return (
//         <div>
//             <Autocomplete 
//             onReplace={ option => { onChangeAuto } }
//             completers={ autocompleters }>
//                 { ( { isExpanded, listBoxId, activeId } ) => (
//                     <div
//                         contentEditable
//                         suppressContentEditableWarning
//                         aria-autocomplete="list"
//                         aria-expanded={ isExpanded }
//                         aria-owns={ listBoxId }
//                         aria-activedescendant={ activeId }
//                     >
//                     </div>
//                 ) }
// 			</Autocomplete>
//             <p class="autocomplete_p">Type @ for triggering the autocomplete.</p>
//         </div>
//     );
// };




// registerBlockType( 'residence-gutenberg-block/membership-package-settings', {
//     title: __( 'Residence - Membership Package Settings' ), // Block title.
//     icon: 'shield', 
//     category: 'common', 
//     keywords: [
//         __( 'membership-package-settings' ),
//     ],
//     attributes:{
//         package_id:{
//             type:'string',
//             select:'p'
//         },
//         package_name:{
//             type:'string',
//         },
//     },


//     edit: function( props ) {

//                 const { attributes: {package_name}, className,setAttributes,isSelected } = props;               
//         return (
//             <div className={ props.className }>
//                             <form>
//                                 <label className="wpresidence_editor_label">Current Package: {package_name}</label>
//                                 <MyAutocomplete></MyAutocomplete>
//                              </form>

//             </div>

//         );
//     },

//     save: function( props ) {
//               // Rendering in PHP
//                 return null;

//     },
// } );

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; 
const { InspectorControls  } = wp.editor; // Import registerBlockType() from wp.blocks
const {
    Toolbar,
    Button,
    Tooltip,
    PanelBody,
    PanelRow,
    FormToggle,
} = wp.components;
const { SelectControl } = wp.components;
const { Component } = wp.element;

import React from 'react';
import Select from 'react-select';

class mySelectPosts1 extends Component {
	static getInitialState( selectedOption ) {
    return {
			posts: [],
			selectedOption: selectedOption,
			post: {}, 
	    };
	}
	// Constructing our component. With super() we are setting everything to 'this'.
	// Now we can access the attributes with this.props.attributes
	constructor() {
		super( ...arguments );
	    this.state = this.constructor.getInitialState( this.props.attributes.selectedOption );
	    // Bind so we can use 'this' inside the method.
	    this.getOptions = this.getOptions.bind(this);
	    // Load posts.
	    this.getOptions();
	    this.onChangeSelectPost = this.onChangeSelectPost.bind(this);
	}

	onChangeSelectPost( value ) {
	    // Find the post
	    const post = this.state.posts.find( ( item ) => { return item.id == parseInt( value ) } );
	    // Set the state
	    this.setState( { selectedOption: parseInt( value ), post } );
	    // Set the attributes
	    this.props.setAttributes( {
			selectedOption: parseInt( value ),
			title: post.title.rendered,
			content: post.excerpt.rendered,
			link: post.link,
	    });
	}

	/**
	* Loading Posts
	*/
	getOptions() {
		return ( new wp.api.collections.Posts() ).fetch( { data: { per_page: 200 } } ).then( ( posts ) => {
			if( posts && 0 !== this.state.selectedOption ) {
				// If we have a selected Post, find that post and add it.
				const post = posts.find( ( item ) => { return item.id == this.state.selectedOption } );
				// This is the same as { post: post, posts: posts }
				this.setState( { post, posts } );
			} else {
				this.setState({ posts });
			}
		});
	}

	render() {
	    let options = [ { value: 0, label: __( 'Select a Post' ) } ];
	    let output  = __( 'Loading Posts' );
	    this.props.className += ' loading';
	    if( this.state.posts.length > 0 ) {
		    const loading = __( 'We have %d posts. Choose one.' );
			output = loading.replace( '%d', this.state.posts.length );
			this.state.posts.forEach((post) => {
				options.push({value:post.id, label:post.title.rendered});
			});
	    } else {
	      output = __( 'No posts found. Please create some first.' );
	    }
	    // Checking if we have anything in the object
	    if( this.state.post.hasOwnProperty('title') ) {
	      output = <div className="post">
	        <a href={ this.state.post.link }><h2 dangerouslySetInnerHTML={ { __html: this.state.post.title.rendered } }></h2></a>
	        <p dangerouslySetInnerHTML={ { __html: this.state.post.excerpt.rendered } }></p>
	        </div>;
	      this.props.className += ' has-post';
	    } else {
	      this.props.className += ' no-post';
	    }
	  //   return [
			// !! this.props.isSelected && ( <InspectorControls key='inspector'>
			// <SelectControl onChange={this.onChangeSelectPost} value={ this.props.attributes.selectedOption } label={ __( 'Select a Post' ) } options={ options } />
			// </InspectorControls>
			// ), 
			// <div className={this.props.className}>{output}</div>
	  //   ]

		// const { attributes: { selectedOption }, className, setAttributes } = props1;
	    // const handleSelectChange = ( selectedOption ) => setAttributes( { selectedOption: JSON.stringify( selectedOption ) } );
	    return [
	        !! this.props.isSelected && ( <InspectorControls key='inspector'>
	            <PanelBody
	                title={ __( 'Select2', 'text-domain' ) }
	            >
	                <PanelRow>
	                    <Select
	                        name='select-two'
	                        value={ this.props.attributes.selectedOption }
	                        onChange={ this.onChangeSelectPost }
	                        // value={ JSON.parse( selectedOption ) }
	                        // onChange={ handleSelectChange }
	                        options={ options }
							// isMulti='true'
	                        />
	                </PanelRow>
	            </PanelBody>
	        </InspectorControls>
	        ), 
			<div className={this.props.className}>{output}</div>
        ]
	}
}

registerBlockType( 'cgb/block-guten-load-post-select2', {
    title: __( 'Load a post in select2' ), // Block title.
    icon: 'shield', 
    category: 'common', 
    keywords: [
        __( 'membership-package-settings' ),
    ],
    attributes:{
	    content: {
			type: 'array',
			source: 'children',
			selector: 'p',
		},
		title: {
			type: 'string',
			selector: 'h2'
		},
		link: {
			type: 'string',
			selector: 'a'
		},
        selectedOption: {
	        type: 'number',
	        default: 0,
	    }
    },


	edit: mySelectPosts1,
   //  edit: props => {
			//     const { attributes: { selectedOption }, className, setAttributes } = props;
			//     const handleSelectChange = ( selectedOption ) => setAttributes( { selectedOption: JSON.stringify( selectedOption ) } );
			//     return [
			//         <InspectorControls>
			//             <PanelBody
			//                 title={ __( 'Select2', 'text-domain' ) }
			//             >
			//                 <PanelRow>
			//                     <Select
			//                         name='select-two'
			//                         value={ JSON.parse( selectedOption ) }
			//                         onChange={ handleSelectChange }
			//                         options={ options }
			// 						isMulti='true'
			//                         />
			//                 </PanelRow>
			//             </PanelBody>
			//         </InspectorControls>
		 //        ]
			// },

    // save: function( props ) {
    //           // Rendering in PHP
    //             return null;

    // },
    save: function( props ) {
	    return (
			<div className={ props.className }>
				<div className="post">
					<a href={ props.attributes.link }><h2 dangerouslySetInnerHTML={ { __html: props.attributes.title } }></h2></a>
					<p dangerouslySetInnerHTML={ { __html: props.attributes.content } }></p>
				</div>
			</div>
	    );
	},
} );