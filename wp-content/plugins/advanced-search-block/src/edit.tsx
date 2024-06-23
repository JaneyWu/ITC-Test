import { useEffect, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, CheckboxControl, TextControl, Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { ITag, ICategory } from './types'
import React from 'react';

const Edit = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState<number[]>([]);


    const [categoriesOptions, setCategoriesOptions] = useState<ICategory[]>([]);
    const [tagsOptions, setTagsOptions] = useState<ITag[]>([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch categories
        apiFetch({ path: '/wp/v2/categories' }).then((categories: any) => {
            setCategoriesOptions(categories.map((cat: any) => ({ label: cat.name, value: cat.id })));
        });

        // Fetch tags
        apiFetch({ path: '/wp/v2/tags' }).then((tags: any) => {
            setTagsOptions(tags.map((tag: any) => ({ label: tag.name, value: tag.id })));
        });

        // Set initial values from URL
        const urlParams = new URLSearchParams(window.location.search);
        setKeyword(urlParams.get('q') || '');
        setCategory(urlParams.get('cat') || '');
        setTags(urlParams.getAll('tags[]').every((tag) => !isNaN(parseInt(tag)) ? parseInt(tag) : 0));
       

        //fetchPosts(urlParams.get('q') || '', urlParams.get('cat') || '', urlParams.getAll('tags[]'));
    }, []);

    // const fetchPosts = (keyword: string, category: string, tags: string[]) => {
    //     const params: { [key: string]: string | string[] } = { search: keyword };
    //     if (category) params.categories = category;
    //     if (tags.length > 0) params.tags = tags;

    //     apiFetch({ path: `/wp/v2/posts`, data: params }).then((response: Post[]) => {
    //         setPosts(response);
    //     });
    // };

    const updateURLParams = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('q', keyword);
        url.searchParams.set('cat', category);
        tags.forEach((tag, index) => {
            url.searchParams.set(`tags[${index}]`, tag.toString());
        });
        window.history.pushState({}, '', url.toString());
    };

    const handleSearch = () => {
        updateURLParams();
        // fetchPosts(keyword, category, tags);
    };

    return (
        <div {...useBlockProps()}>
            <TextControl
                label="Keyword"
                value={keyword}
                onChange={(value) => setKeyword(value)}
            />
            <SelectControl
                label="Category"
                value={category}
                options={categoriesOptions}
                onChange={(value) => setCategory(value)}
            />
            <div>
                <span>Tags: </span>
                {tagsOptions.map((tag) => (
                    <CheckboxControl
                        key={tag.id}
                        label={tag.name}
                        checked={tags.length > 0 && tags.includes(tag.id)}
                        onChange={(isChecked) => {
                            if (isChecked) {
                                setTags([...tags, tag.id]);
                            } else {
                                setTags(tags.filter((t) => t !== tag.id));
                            }
                        }}
                    />
                ))}
            </div>
            <Button variant="primary" onClick={handleSearch}>Search</Button>
            <div className="search-results">
                {posts.map((post: any) => (
                    <div key={post.id}>
                        <a href={post.link}>{post.title.rendered}</a>
                        <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Edit;
