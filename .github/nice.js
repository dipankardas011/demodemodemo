module.exports = async ({github, context, core}) => {
    const {TESTING_OCI_ARTIFACT_SUFFIX,COMMIT_SHA} = process.env;
    await github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `## Steps on How to run testing
        > [!NOTE]
        > Given below steps help you to run the e2e tests on the PRs latest changes
        > using the latest built images.

        > [!WARNING]
        > These images are built for testing purposes only and should not be used in production.

        \`\`\`shell
        # first need to generate the application controller installer
        # make sure you don't push it to the PR
        make build-installer CONTROLLER="application" CUSTOM_LOCATION_GEN_CONTROLLER_MANIFEST="/tmp/ksctl-manifest.yaml" IMG_SUFFIX="${TESTING_OCI_ARTIFACT_SUFFIX}" IMG_TAG_VERSION="${COMMIT_SHA}"

        cd test/e2e
        go build -v -ldflags="-X 'github.com/ksctl/ksctl/commons.OCIVersion=${COMMIT_SHA}' -X 'github.com/ksctl/ksctl/commons.OCIImgSuffix=${TESTING_OCI_ARTIFACT_SUFFIX}'" .
        export E2E_FLAGS="debug;core_component_overridings=application=file:::/tmp/aaaa.yaml" ## you can eliminate the debug
        ./e2e -op create -file local/create.json
        ./e2e -op switch -file local/switch.json
        ./e2e -op delete -file local/delete.json
        \`\`\`
        Please make sure you've read our [contributing guide](CONTRIBUTING.md) and Happy Testing locally ✨
        `
    })
}
