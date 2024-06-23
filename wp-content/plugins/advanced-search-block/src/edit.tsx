import { useEffect, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, CheckboxControl, TextControl, Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { ITag, ICategory, IPost } from './types'
import React from 'react';

const Edit = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);

    useEffect(() => {
        // Fetch categories
        apiFetch({ path: '/wp/v2/categories' }).then((categories: any) => {
            setCategories(categories);
        });

        // Fetch tags
        apiFetch({ path: '/wp/v2/tags' }).then((tags: any) => {
            setAvailableTags(tags);
        });

        // Set initial values from URL
        const urlParams = new URLSearchParams(window.location.search);
        setKeyword(urlParams.get('q') || '');
        setCategory(urlParams.get('cat') || '');
        const tags = urlParams.getAll('tags[]');
        setSelectedTags(tags.length ? tags.map((tag) => Number(tag)) : []);


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
        selectedTags.forEach((tag) => {
            url.searchParams.append('tags[]', tag.toString());
        });
        window.history.pushState({}, '', url);
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
                onChange={(value) => setCategory(value)} >
                <option value="">Select a category</option>
                {categories.map((category: ICategory) =>
                    (<option value={category.id}>{category.name}</option>)
                )}
            </SelectControl>
            <div>
            <span className="inline-block">Tags:</span>
                {availableTags.map((tag: ITag) => (
                    <CheckboxControl
                        className="inline-block"
                        key={tag.id}
                        label={tag.name}
                        checked={selectedTags.includes(tag.id)}
                        onChange={(isChecked) => {
                            if (isChecked) {
                                setSelectedTags([...selectedTags, tag.id]);
                            } else {
                                setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                            }
                        }}
                    />
                ))}
            </div>
            <Button className="submit-btn" variant="primary" text="Search" onClick={handleSearch} />
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
