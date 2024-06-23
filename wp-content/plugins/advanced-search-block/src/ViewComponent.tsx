import React, { useState, useEffect, } from "react";
import { SelectControl, CheckboxControl, TextControl, } from '@wordpress/components';
import { Flex, FlexItem, Button, ButtonGroup } from '@wordpress/components';
import "./style.scss";
import { ITag, ICategory, IPost } from "./types";
import axios from "axios";
const POSTS_PER_PAGE = 3

export default function ViewComponent() {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Set initial values from URL
        const urlParams = new URLSearchParams(window.location.search);

        const keyword = urlParams.get('q') || ''
        setKeyword(keyword);

        const category = urlParams.get('cat') || '';
        setCategory(category);

        const tags = urlParams.getAll('tags[]');
        const selectedTags = tags.length ? tags.map((tag) => Number(tag)) : []
        setSelectedTags(selectedTags);

        fetchPosts(keyword, category, selectedTags);

    }, []);

    useEffect(() => {
        axios.get<ICategory[]>('/wordpress/wp-json/wp/v2/categories')
            .then(response => setCategories(response.data));

        axios.get<ITag[]>('/wordpress/wp-json/wp/v2/tags')
            .then(response => setAvailableTags(response.data));
    }, []);

    const changePage = (page: number) => {
        setPage(page);
        fetchPosts(keyword || '', category || '', selectedTags, page);
    }

    const handleSearch = () => {
        setPage(1);
        fetchPosts(keyword || '', category || '', selectedTags);
    };

    const fetchPosts = (search: string, categories: string, tags: number[], page = 1) => {
        const params: { [key: string]: number | string | number[] } = { search };
        if (categories) params.categories = categories;
        if (tags.length > 0) params.tags = tags;
        params.per_page = POSTS_PER_PAGE;
        params.page = page;

        axios.get<IPost[]>('/wordpress/wp-json/wp/v2/posts', { params })
            .then(response => {
                console.log(response.data);
                console.log(response.headers);
                setPosts(response.data)
                setTotalPages(parseInt(response.headers['x-wp-totalpages'], 10));
            });
    };

    return (
        <div>
            <Flex align="flex-end">
                <FlexItem>
                    <TextControl
                        label="Keyword"
                        value={keyword}
                        onChange={(value) => setKeyword(value)}
                        placeholder="Search..."
                        maxLength={80}
                    />
                </FlexItem>
                <FlexItem>
                    <SelectControl
                        label="Category"
                        value={category}
                        onChange={(value) => setCategory(value)} >
                        <option value="">Select a category</option>
                        {categories.map((category: ICategory) =>
                            (<option value={category.id}>{category.name}</option>)
                        )}
                    </SelectControl>
                </FlexItem>
                <FlexItem>
                    <Button className="submit-btn" variant="primary" text="Search" onClick={handleSearch} />
                </FlexItem>
            </Flex>
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
            <div className="search-results">
                {posts.map((post: IPost) => (
                    <div className="article-item" key={post.id}>
                        <h2>{post.title.rendered}</h2>
                        <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                    </div>
                ))}
            </div>
            <div className="pagination">
                <ButtonGroup>
                    <Button
                        onClick={() => changePage(page - 1)}
                        disabled={page <= 1}
                        className={page <= 1 ? 'disabled' : ''}
                    >
                        Previous
                    </Button>
                    {
                        Array.from({ length: totalPages }, (_, index) => (
                            <Button
                                key={index}
                                onClick={() => changePage(index + 1)}
                                variant={page === index + 1 ? 'primary' : ''}
                            >
                                {index + 1}
                            </Button>
                        ))
                    }
                    <Button
                        onClick={() => changePage(page + 1)}
                        disabled={page >= totalPages}
                        className={page >= totalPages ? 'disabled' : ''}
                    >
                        Next
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    )
}